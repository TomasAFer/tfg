import { useState } from 'react';
import { useConfigStore } from '@/store/config.store';
import { apiService } from '@/services/api.service';
import { ContactFormModal } from '@/components/ContactFormModal';
import { ContactSuccessModal } from '@/components/ContactSuccessModal';
import { SummaryDeleteConfirmModal } from '@/components/SummaryDeleteConfirmModal';
import {
  SummaryHeader,
  SummaryConfigCard,
} from '@/components/summary';
import { useTranslation } from '@/hooks/useTranslation';

interface SummaryViewProps {
  onBack: () => void;
  onClose: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ onBack }) => {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteEmpresa, setClienteEmpresa] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [clienteComentario, setClienteComentario] = useState('');
  const [mostrarFormularioEnvio, setMostrarFormularioEnvio] = useState(false);
  const [mostrarSuccessModal, setMostrarSuccessModal] = useState(false);
  const [erroresFormulario, setErroresFormulario] = useState<string | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const {
    summaryItems,
    eliminarDelResumen,
    modoEntrada,
    industriaSeleccionada,
  } = useConfigStore();
  const { t } = useTranslation();

  const handleAbrirFormularioEnvio = () => {
    setMostrarFormularioEnvio(true);
    setErroresFormulario(null);
  };

  const handleEnviar = async () => {
    if (summaryItems.length === 0) {
      setErroresFormulario(t('summary.form.error.empty'));
      return;
    }

    if (!clienteNombre || !clienteEmpresa || !clienteEmail) {
      setErroresFormulario(t('summary.form.error.fields'));
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(clienteEmail)) {
      setErroresFormulario(t('summary.form.error.email'));
      return;
    }

    try {
      setEnviando(true);
      await apiService.enviarSolicitud({
        nombre: clienteNombre,
        empresa: clienteEmpresa,
        email: clienteEmail,
        telefono: clienteTelefono,
        comentario: clienteComentario,
        configuracion_robots: summaryItems,
        precio_total: 0,
        estado: 'pendiente',
      });
      setEnviado(true);
      setMostrarFormularioEnvio(false);
      setErroresFormulario(null);
      setClienteNombre('');
      setClienteEmpresa('');
      setClienteEmail('');
      setClienteTelefono('');
      setClienteComentario('');
      // Mostrar modal de éxito en lugar de alert
      setMostrarSuccessModal(true);
    } catch (error) {
      console.error(error);
      setErroresFormulario(t('summary.form.error.send'));
    } finally {
      setEnviando(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRequestDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      eliminarDelResumen(deleteIndex);
      setDeleteIndex(null);
    }
  };

  const handleCancelDelete = () => setDeleteIndex(null);

  // Empty state
  if (summaryItems.length === 0) {
    return (
      <div className="w-full space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('summary.title')}
          </h2>
          <p className="text-gray-600">{t('summary.emptyTitle')}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl text-center border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">📋</div>
            <p className="text-lg text-gray-700 font-medium">
              {t('summary.emptyTitle')}
            </p>
            <p className="text-gray-600">
              {t('summary.emptyDescription')}
            </p>
            <button
              onClick={onBack}
              className="mt-4 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition shadow-md hover:shadow-lg"
            >
              {t('summary.configureRobot')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .summary-card {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-before: auto;
            margin-bottom: 20px;
          }
          .summary-card:first-of-type {
            page-break-before: avoid;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 1.5cm;
          }
          header {
            display: none !important;
          }
          footer {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .summary-root {
            padding: 1cm 1.5cm !important;
          }
        }
      `}</style>

      <div className="summary-root w-full space-y-8 print:space-y-6">
        {/* Header */}
        <SummaryHeader
          itemsCount={summaryItems.length}
          modoEntrada={modoEntrada}
          industriaNombre={industriaSeleccionada?.nombre}
        />

        {/* Lista de Configuraciones */}
        <div className="space-y-8 print:space-y-6">
          {summaryItems.map((item, index) => (
            <SummaryConfigCard
              key={index}
              item={item}
              index={index}
              onEliminar={handleRequestDelete}
            />
          ))}
        </div>

        {/* Footer con botones de acción */}
        <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t-2 border-gray-300">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition text-gray-700 hover:border-gray-400"
          >
            {t('summary.back')}
          </button>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePrint}
              className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-semibold transition shadow-md hover:shadow-lg"
            >
              {t('summary.print')}
            </button>
            <button
              onClick={handleAbrirFormularioEnvio}
              disabled={summaryItems.length === 0 || enviando || enviado}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition shadow-md hover:shadow-lg"
            >
              {enviando
                ? t('summary.sending')
                : enviado
                  ? t('summary.sentLabel')
                  : t('summary.sendToSales')}
            </button>
          </div>
        </div>
      </div>

      <ContactFormModal
        open={mostrarFormularioEnvio}
        onClose={() => setMostrarFormularioEnvio(false)}
        onSubmit={handleEnviar}
        enviando={enviando}
        clienteNombre={clienteNombre}
        clienteEmpresa={clienteEmpresa}
        clienteEmail={clienteEmail}
        setClienteNombre={setClienteNombre}
        setClienteEmpresa={setClienteEmpresa}
        setClienteEmail={setClienteEmail}
        clienteTelefono={clienteTelefono}
        setClienteTelefono={setClienteTelefono}
        clienteComentario={clienteComentario}
        setClienteComentario={setClienteComentario}
        erroresFormulario={erroresFormulario}
      />
      <ContactSuccessModal
        open={mostrarSuccessModal}
        onClose={() => setMostrarSuccessModal(false)}
      />
      <SummaryDeleteConfirmModal
        open={deleteIndex !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};
