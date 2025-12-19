import { useTranslation } from '@/hooks/useTranslation';
import type { Robot } from '@/types/api';

interface RobotInfoProps {
  robot: Robot;
  configNumber: number;
}

export const RobotInfo: React.FC<RobotInfoProps> = ({ robot, configNumber }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 print:bg-white print:border print:border-gray-300">
      {/* Header con número de configuración */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
        <span className="inline-block bg-primary-600 text-white text-sm font-bold px-4 py-1.5 rounded-full print:bg-gray-800">
          {t('summary.configNumber')} {configNumber}
        </span>
      </div>

      {/* Robot Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen */}
        {robot.imagen?.url && (
          <div className="relative md:w-40 md:h-40 w-full h-48 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden print:border-gray-400">
            {robot.colaborativo && (
              <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-300 print:border-gray-400 z-10">
               {t('robots.collaborativeTag')}
              </span>
            )}
            <img
              src={robot.imagen.url}
              alt={robot.modelo}
              className="w-full h-full object-contain p-3"
            />
          </div>
        )}

        {/* Detalles del Robot */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1 print:text-xl">
              {robot.modelo}
            </h2>
            <p className="text-sm text-gray-600 print:text-xs">
              {t('summary.codeLabel')} {robot.codigo_modelo}
            </p>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200 print:border-gray-300">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                {t('summary.familyLabel')}
              </p>
              <p className="text-base font-semibold text-gray-900 print:text-sm">
                {robot.familia?.nombre || t('common.na')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200 print:border-gray-300">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                {t('summary.axesLabel')}
              </p>
              <p className="text-base font-semibold text-primary-600 print:text-gray-900 print:text-sm">
                {robot.ejes}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200 print:border-gray-300">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                {t('summary.payloadLabel')}
              </p>
              <p className="text-base font-semibold text-primary-600 print:text-gray-900 print:text-sm">
                {robot.carga_max_kg} {t('units.kg')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200 print:border-gray-300">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                {t('summary.reachLabel')}
              </p>
              <p className="text-base font-semibold text-primary-600 print:text-gray-900 print:text-sm">
                {robot.alcance_maximo_mm} {t('units.mm')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
