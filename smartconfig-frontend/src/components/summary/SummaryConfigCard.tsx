import { useTranslation } from '@/hooks/useTranslation';
import type { SummaryItem } from '@/store/config.store';
import { RobotInfo } from './RobotInfo';
import { ControllerInfo } from './ControllerInfo';
import { AccessoriesTable } from './AccessoriesTable';

interface SummaryConfigCardProps {
  item: SummaryItem;
  index: number;
  onEliminar: (index: number) => void;
}

export const SummaryConfigCard: React.FC<SummaryConfigCardProps> = ({
  item,
  index,
  onEliminar,
}) => {
  const { t } = useTranslation();

  return (
    <div className="summary-card bg-white border-2 border-gray-300 rounded-2xl overflow-hidden shadow-sm print:shadow-none print:border-gray-400 print:page-break-inside-avoid">
      {/* Header con botón eliminar */}
      <div className="bg-primary-600 px-6 py-4 flex items-center justify-between print:bg-gray-800">
        <h2 className="text-xl font-bold text-white print:text-lg">
          {t('summary.configNumber')} {index + 1}
        </h2>
        <button
          onClick={() => onEliminar(index)}
          className="no-print text-white hover:text-red-200 text-sm font-medium px-3 py-1.5 bg-red-600 rounded-lg transition"
        >
          ✕ {t('summary.deleteButton')}
        </button>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-6">
        {/* Robot Info */}
        <RobotInfo robot={item.robot} configNumber={index + 1} />

        {/* Controladora */}
        {item.controladora && <ControllerInfo controladora={item.controladora} />}

        {/* Accesorios */}
        <AccessoriesTable accesorios={item.accesorios} />
      </div>
    </div>
  );
};
