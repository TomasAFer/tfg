import { useState } from 'react';
import { useConfigStore } from '@/store/config.store';
import { RobotConfigurationForm } from '@/components/RobotConfigurationForm';
import type { Robot } from '@/types/api';
import { useTranslation } from '@/hooks/useTranslation';

interface SummaryItem {
  robot: Robot;
  controladora: any;
  accesorios: any[];
}

interface RobotDetailsModalProps {
  open: boolean;
  robot: Robot | null;
  onClose: () => void;
  onAddToSummary?: () => void;
  onContinueConfiguration?: () => void;
}

export const RobotDetailsModal: React.FC<RobotDetailsModalProps> = ({
  open,
  robot,
  onClose,
  onAddToSummary,
}) => {
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useTranslation();

  const {
    controladoraSeleccionada,
    accesoriosSeleccionados,
    agregarAlResumen,
    setRobotSeleccionado,
    setControladoraSeleccionada,
  } = useConfigStore();

  const handleAddToSummary = () => {
    if (!robot || !controladoraSeleccionada) {
      alert(t('errors.selectController'));
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmAccept = () => {
    if (!robot || !controladoraSeleccionada) return;
    const item: SummaryItem = {
      robot,
      controladora: controladoraSeleccionada,
      accesorios: accesoriosSeleccionados,
    };
    agregarAlResumen(item);

    // Resetear la selección actual para permitir configurar otro robot
    setRobotSeleccionado(null);
    setControladoraSeleccionada(null);

    onAddToSummary?.();
    setConfirmOpen(false);
    onClose();
  };

  const handleConfirmCancel = () => setConfirmOpen(false);

  if (!open || !robot) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 flex items-center justify-center bg-black/50 z-40" style={{ top: '0px' }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 mx-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{robot.modelo}</h2>
            <p className="text-gray-600 text-sm mt-1">{robot.codigo_modelo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Imagen y datos técnicos principales */}
          <div className="md:col-span-1">
            {robot.imagen?.url && (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 h-48 flex items-center justify-center">
                {robot.colaborativo && (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2.5 py-1.5 rounded-full font-medium border border-green-300 z-10">
                   {t('robots.collaborativeTag')}
                  </span>
                )}
                <img
                  src={robot.imagen.url}
                  alt={robot.modelo}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Datos técnicos en cards */}
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">{t('summary.axesLabel')}</p>
                <p className="text-2xl font-bold text-primary-600">{robot.ejes}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">{t('summary.payloadLabel')}</p>
                <p className="text-2xl font-bold text-primary-600">{robot.carga_max_kg} {t('units.kg')}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">{t('summary.reachLabel')}</p>
                <p className="text-2xl font-bold text-primary-600">{robot.alcance_maximo_mm} {t('units.mm')}</p>
              </div>
            </div>
          </div>

          {/* Descripción y configuración */}
          <div className="md:col-span-2 space-y-6">
            {/* Descripción */}
            {robot.descripcion && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('robotDetails.description')}</h3>
                <div
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: robot.descripcion }}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {robot.familia && (
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">{t('summary.familyLabel')}</p>
                  <p className="font-semibold text-gray-900">{robot.familia.nombre}</p>
                </div>
              )}
              {robot.proteccion && (
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">{t('robotDetails.protectionLabel')}</p>
                  <p className="font-semibold text-gray-900">{robot.proteccion}</p>
                </div>
              )}
            </div>

            {/* Configuración (simplificada en modal, completa si va a ConfigurationView) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('robotDetails.configurationTitle')}</h3>
              <RobotConfigurationForm
                robot={robot}
                onLoadingChange={setFormLoading}
                onErrorChange={setFormError}
                compact={false}
              />
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {formError}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t relative">
          {confirmOpen && (
            <div className="absolute right-0 bottom-16 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72">
              <p className="text-sm font-semibold text-gray-900 mb-2">{t('robotDetails.confirmTitle')}</p>
              <p className="text-xs text-gray-600 mb-3">
                {t('robotDetails.confirmMessage')}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleConfirmCancel}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  onClick={handleConfirmAccept}
                  disabled={formLoading}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50"
                >
                  {t('robotDetails.confirmAccept')}
                </button>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            {t('buttons.close')}
          </button>
          <button
            onClick={handleAddToSummary}
            disabled={formLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
          >
            ✓ {t('buttons.addToSummary')}
          </button>
        </div>
      </div>
    </div>
  );
};

