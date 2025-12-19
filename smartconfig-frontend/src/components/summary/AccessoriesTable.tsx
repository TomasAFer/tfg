import { useTranslation } from '@/hooks/useTranslation';
import type { AccesorioSeleccionado } from '@/store/config.store';

interface AccessoriesTableProps {
  accesorios: AccesorioSeleccionado[];
}

export const AccessoriesTable: React.FC<AccessoriesTableProps> = ({ accesorios }) => {
  const { t } = useTranslation();

  if (accesorios.length === 0) return null;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden print:border-gray-300">
      <div className="bg-gray-100 px-5 py-3 border-b border-gray-200 print:bg-white">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          🔧 {t('summary.accessoriesTitle')} ({accesorios.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 print:bg-white">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-gray-700">
                {t('summary.accessoryName')}
              </th>
              <th className="px-5 py-3 text-center font-semibold text-gray-700">
                {t('summary.quantity')}
              </th>
              <th className="px-5 py-3 text-center font-semibold text-gray-700">
                {t('summary.mandatory')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {accesorios.map((acc, idx) => (
              <tr
                key={acc.accesorio.id}
                className={
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-white'
                }
              >
                <td className="px-5 py-3 text-gray-900 font-medium">
                  {acc.accesorio.nombre_corto}
                </td>
                <td className="px-5 py-3 text-center text-gray-700 font-semibold">
                  {acc.cantidad}
                </td>
                <td className="px-5 py-3 text-center">
                  {acc.obligatorio ? (
                    <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded print:bg-white print:border print:border-red-800">
                      {t('common.yes')}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">{t('common.no')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
