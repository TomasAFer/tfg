import React, { useEffect } from 'react';
import type { FiltrosTecnicos } from '@/types/api';
import { RangeSlider } from '@/components/RangeSlider';
import { useRobotRanges } from '@/hooks/useRobotRanges';
import { useTranslation } from '@/hooks/useTranslation';

export type FiltrosTecnicosExtendidos = FiltrosTecnicos & {
  industriaId?: number;
};

interface FiltersSidebarProps {
  title?: string;
  value: FiltrosTecnicosExtendidos;
  onChange: (next: FiltrosTecnicosExtendidos) => void;
  onApply?: () => void;
  onReset?: () => void;
  industrias?: Array<{ id: number; nombre: string; documentId?: string }>;
  className?: string;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  title = 'Filtros',
  value,
  onChange,
  onApply,
  onReset,
  industrias = [],
  className = '',
}) => {
  const { t } = useTranslation();
  
  const industriaDocId = value.industriaId 
    ? industrias.find(i => i.id === value.industriaId)?.documentId 
    : undefined;
  
  const { ranges, loading: rangesLoading } = useRobotRanges(industriaDocId);

  useEffect(() => {
    if (rangesLoading) return;

    const clamp = (num: number | undefined, minVal: number, maxVal: number) => {
      if (num === undefined) return undefined;
      return Math.min(Math.max(num, minVal), maxVal);
    };

    let changed = false;

    let cargaMin = clamp(value.carga_min, ranges.carga.min, ranges.carga.max);
    let cargaMax = clamp(value.carga_max, ranges.carga.min, ranges.carga.max);
    let alcanceMin = clamp(value.alcance_min, ranges.alcance.min, ranges.alcance.max);
    let alcanceMax = clamp(value.alcance_max, ranges.alcance.min, ranges.alcance.max);
    let proteccion = value.proteccion;

    if (cargaMin !== value.carga_min || cargaMax !== value.carga_max) changed = true;
    if (alcanceMin !== value.alcance_min || alcanceMax !== value.alcance_max) changed = true;

    if (cargaMin !== undefined && cargaMax !== undefined && cargaMin > cargaMax) {
      cargaMin = ranges.carga.min;
      cargaMax = ranges.carga.max;
      changed = true;
    }

    if (alcanceMin !== undefined && alcanceMax !== undefined && alcanceMin > alcanceMax) {
      alcanceMin = ranges.alcance.min;
      alcanceMax = ranges.alcance.max;
      changed = true;
    }

    if (proteccion && !ranges.protecciones.includes(proteccion)) {
      proteccion = undefined;
      changed = true;
    }

    if (changed) {
      onChange({
        ...value,
        carga_min: cargaMin,
        carga_max: cargaMax,
        alcance_min: alcanceMin,
        alcance_max: alcanceMax,
        proteccion,
      });
    }
  }, [rangesLoading, ranges, value, onChange]);
  
  const update = (patch: Partial<FiltrosTecnicosExtendidos>) =>
    onChange({ ...value, ...patch });

  const handleColabChange = (val: string) => {
    if (val === '') return update({ colaborativo: undefined });
    update({ colaborativo: val === 'true' });
  };

  const handleIndustriaChange = (val: string) => {
    update({ industriaId: val === '' ? undefined : Number(val) });
  };

  // Contar filtros activos de manera inteligente
  const activeFiltersCount = (() => {
    let count = 0;
    
    // Contar carga útil (solo si no está en los límites del rango completo)
    const cargaModified = 
      (value.carga_min !== undefined && value.carga_min !== ranges.carga.min) ||
      (value.carga_max !== undefined && value.carga_max !== ranges.carga.max);
    if (cargaModified) count++;
    
    // Contar alcance (solo si no está en los límites del rango completo)
    const alcanceModified = 
      (value.alcance_min !== undefined && value.alcance_min !== ranges.alcance.min) ||
      (value.alcance_max !== undefined && value.alcance_max !== ranges.alcance.max);
    if (alcanceModified) count++;
    
    // Contar ejes (solo si no es undefined o vacío)
    if (value.ejes !== undefined && value.ejes !== null) count++;
    
    // Contar colaborativo (solo si tiene valor definido)
    if (value.colaborativo !== undefined) count++;
    
    // Contar protección (solo si no es undefined o vacío)
    if (value.proteccion !== undefined && value.proteccion !== '' && value.proteccion !== null) count++;
    
    return count;
  })();

  return (
    <aside className={`w-full md:w-80 bg-white border rounded-xl p-4 space-y-4 md:sticky md:top-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {activeFiltersCount > 0 && (
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {activeFiltersCount} {t('filters.activeFilters')}
          </span>
        )}
      </div>

      {/* Industria - Primero para que afecte los rangos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.industry')}</label>
        <select
          value={value.industriaId ?? ''}
          onChange={(e) => handleIndustriaChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.allIndustries')}</option>
          {industrias.map((i) => (
            <option key={i.id} value={i.id}>
              {i.nombre}
            </option>
          ))}
        </select>
      </div>

      {rangesLoading ? (
        <div className="text-center py-4 text-gray-500">{t('filters.loadingRanges')}</div>
      ) : (
        <>
          {/* Carga útil */}
          <RangeSlider
            min={ranges.carga.min}
            max={ranges.carga.max}
            step={0.5}
            valueMin={value.carga_min ?? ranges.carga.min}
            valueMax={value.carga_max ?? ranges.carga.max}
            onChange={(min, max) => update({ carga_min: min, carga_max: max })}
            label={t('filters.payload')}
            unit={t('units.kg')}
          />

          {/* Alcance */}
          <RangeSlider
            min={ranges.alcance.min}
            max={ranges.alcance.max}
            step={50}
            valueMin={value.alcance_min ?? ranges.alcance.min}
            valueMax={value.alcance_max ?? ranges.alcance.max}
            onChange={(min, max) => update({ alcance_min: min, alcance_max: max })}
            label={t('filters.reach')}
            unit={t('units.mm')}
          />
        </>
      )}

      {/* Ejes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.axes')}</label>
        <select
          value={value.ejes ?? ''}
          onChange={(e) => update({ ejes: e.target.value === '' ? undefined : Number(e.target.value) })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.allAxes')}</option>
          <option value="4">4 {t('filters.axes')}</option>
          <option value="6">6 {t('filters.axes')}</option>
          <option value="7">7 {t('filters.axes')}</option>
        </select>
      </div>

      {/* Colaborativo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.collaborative')}</label>
        <select
          value={value.colaborativo === undefined ? '' : String(value.colaborativo)}
          onChange={(e) => handleColabChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.indifferent')}</option>
          <option value="true">{t('filters.yes')}</option>
          <option value="false">{t('filters.no')}</option>
        </select>
      </div>

      {/* Protección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('filters.protection')}</label>
        <select
          value={value.proteccion ?? ''}
          onChange={(e) => update({ proteccion: e.target.value || undefined })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.all')}</option>
          {ranges.protecciones.map((proteccion) => (
            <option key={proteccion} value={proteccion}>
              {proteccion}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t">
        <button
          type="button"
          onClick={onReset}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          {t('filters.clearFilters')}
        </button>
        <button
          type="button"
          onClick={onApply}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
        >
          {t('filters.applyFilters')}
        </button>
      </div>
    </aside>
  );
};
