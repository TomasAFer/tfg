import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SummaryDeleteConfirmModal: React.FC<Props> = ({ open, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('summary.deleteButton')}</h3>
        <p className="text-sm text-gray-700">{t('summary.deleteConfirm')}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            {t('buttons.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            {t('buttons.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};
