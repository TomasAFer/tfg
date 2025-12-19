import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  enviando: boolean;
  clienteNombre: string;
  clienteEmpresa: string;
  clienteEmail: string;
  setClienteNombre: (v: string) => void;
  setClienteEmpresa: (v: string) => void;
  setClienteEmail: (v: string) => void;
  clienteTelefono: string;
  setClienteTelefono: (v: string) => void;
  clienteComentario: string;
  setClienteComentario: (v: string) => void;
  erroresFormulario: string | null;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  enviando,
  clienteNombre,
  clienteEmpresa,
  clienteEmail,
  setClienteNombre,
  setClienteEmpresa,
  setClienteEmail,
  clienteTelefono,
  setClienteTelefono,
  clienteComentario,
  setClienteComentario,
  erroresFormulario,
}) => {
  const { t } = useTranslation();

  if (!open) return null;
  return (
    <div className="no-print fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {t('contactForm.title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('contactForm.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              {t('contactForm.nameLabel')}
            </label>
            <input
              type="text"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              {t('contactForm.companyLabel')}
            </label>
            <input
              type="text"
              value={clienteEmpresa}
              onChange={(e) => setClienteEmpresa(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              {t('contactForm.emailLabel')}
            </label>
            <input
              type="email"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              {t('contactForm.phoneLabel')}
            </label>
            <input
              type="tel"
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              {t('contactForm.commentLabel')}
            </label>
            <textarea
              value={clienteComentario}
              onChange={(e) => setClienteComentario(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {erroresFormulario && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {erroresFormulario}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('contactForm.cancel')}
          </button>
          <button
            onClick={onSubmit}
            disabled={enviando}
            className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-60"
          >
            {enviando ? t('contactForm.sending') : t('contactForm.send')}
          </button>
        </div>
      </div>
    </div>
  );
};
