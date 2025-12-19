import { useTranslation } from '@/hooks/useTranslation';
import type { Controladora } from '@/types/api';

interface ControllerInfoProps {
  controladora: Controladora;
}

export const ControllerInfo: React.FC<ControllerInfoProps> = ({ controladora }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl p-5 print:border-gray-300">
      <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-3 print:text-gray-900">
        {t('summary.controller')}
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-gray-900 print:text-base">
          {controladora.nombre}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {controladora.ejes_max_soportados && (
            <div>
              <span className="font-medium">{t('controller.axesMax')}</span>{' '}
              {controladora.ejes_max_soportados}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
