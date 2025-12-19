import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const ContactSuccessModal: React.FC<ContactSuccessModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {t('summary.sentLabel')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('summary.sent')}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
          >
            {t('buttons.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
