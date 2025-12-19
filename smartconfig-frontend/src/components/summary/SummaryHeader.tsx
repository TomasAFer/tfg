import { useTranslation } from '@/hooks/useTranslation';

interface SummaryHeaderProps {
  itemsCount: number;
  modoEntrada: string | null;
  industriaNombre?: string;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  itemsCount,
  modoEntrada,
  industriaNombre,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 print:mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 print:text-3xl">
          {t('summary.title')}
        </h1>
        <p className="text-lg text-gray-600 print:text-base">
          {itemsCount} {t('summary.items')}
        </p>
      </div>
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-5 print:bg-white print:border-gray-300">
        <h3 className="text-sm font-semibold text-primary-900 uppercase tracking-wide mb-2 print:text-gray-900">
          {t('summary.selectionModeTitle')}
        </h3>
        <p className="text-base font-medium text-gray-900">
          {modoEntrada === 'industria'
            ? t('summary.mode.industry')
            : t('summary.mode.params')}
        </p>
        {industriaNombre && (
          <p className="text-sm text-gray-700 mt-1">
            {t('summary.industryLabel')} <strong>{industriaNombre}</strong>
          </p>
        )}
      </div>
    </div>
  );
};
