import { useState } from 'react';
import { useConfigStore } from '@/store/config.store';
import type { FiltrosTecnicos } from '@/types/api';
import { RangeSlider } from '@/components/RangeSlider';
import { useRobotRanges } from '@/hooks/useRobotRanges';
import { useTranslation } from '@/hooks/useTranslation';

interface TechFiltersViewProps {
  onApply: () => void;
  onBack: () => void;
}

export const TechFiltersView: React.FC<TechFiltersViewProps> = ({ onApply, onBack }) => {
  const setFiltrosTecnicos = useConfigStore((state) => state.setFiltrosTecnicos);
  const [filtros, setFiltros] = useState<FiltrosTecnicos>({});
  const { t } = useTranslation();
  
  const { ranges, loading: rangesLoading } = useRobotRanges();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFiltrosTecnicos(filtros);
    onApply();
  };

  const handleReset = () => {
    setFiltros({});
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('techFilters.title')}</h2>
        <p className="text-gray-600">{t('techFilters.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {rangesLoading ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              {t('filters.loadingRanges')}
            </div>
          ) : (
            <>
              {/* Carga útil */}
              <RangeSlider
                min={ranges.carga.min}
                max={ranges.carga.max}
                step={0.5}
                valueMin={filtros.carga_min ?? ranges.carga.min}
                valueMax={filtros.carga_max ?? ranges.carga.max}
                onChange={(min, max) => setFiltros({ ...filtros, carga_min: min, carga_max: max })}
                label={t('filters.payload')}
                unit={t('units.kg')}
              />

              {/* Alcance */}
              <RangeSlider
                min={ranges.alcance.min}
                max={ranges.alcance.max}
                step={50}
                valueMin={filtros.alcance_min ?? ranges.alcance.min}
                valueMax={filtros.alcance_max ?? ranges.alcance.max}
                onChange={(min, max) => setFiltros({ ...filtros, alcance_min: min, alcance_max: max })}
                label={t('filters.reach')}
                unit={t('units.mm')}
              />
            </>
          )}

          {/* Número de ejes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('filters.axes')}
            </label>
            <select
              value={filtros.ejes || ''}
              onChange={(e) => setFiltros({ ...filtros, ejes: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t('filters.allAxes')}</option>
              <option value="4">4 {t('filters.axes')}</option>
              <option value="6">6 {t('filters.axes')}</option>
              <option value="7">7 {t('filters.axes')}</option>
            </select>
          </div>

          {/* Colaborativo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('filters.collaborative')}
            </label>
            <select
              value={filtros.colaborativo === undefined ? '' : String(filtros.colaborativo)}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  colaborativo: e.target.value === '' ? undefined : e.target.value === 'true',
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t('filters.indifferent')}</option>
              <option value="true">{t('filters.yes')}</option>
              <option value="false">{t('filters.no')}</option>
            </select>
          </div>

          {/* Grado de protección */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('filters.protection')}
            </label>
            <select
              value={filtros.proteccion || ''}
              onChange={(e) => setFiltros({ ...filtros, proteccion: e.target.value || undefined })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t('filters.all')}</option>
              {!rangesLoading && ranges.protecciones.map((proteccion) => (
                <option key={proteccion} value={proteccion}>
                  {proteccion}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t('techFilters.resetButton')}
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('buttons.back')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {t('filters.applyFilters')} →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
