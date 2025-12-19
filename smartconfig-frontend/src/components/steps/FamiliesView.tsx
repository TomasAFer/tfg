import { useEffect, useState, useMemo } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useConfigStore } from '@/store/config.store';
import { apiService } from '@/services/api.service';
import type { Familia } from '@/types/api';
import { FiltersSidebar, type FiltrosTecnicosExtendidos } from '@/components/FiltersSidebar';
import { useTranslation } from '@/hooks/useTranslation';

interface FamiliesViewProps {
  onSelect: () => void;
  onBack: () => void;
}

export const FamiliesView: React.FC<FamiliesViewProps> = ({ onSelect, onBack }) => {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modoEntrada = useConfigStore((state) => state.modoEntrada);
  const industriaSeleccionada = useConfigStore((state) => state.industriaSeleccionada);
  const filtrosTecnicosGlobal = useConfigStore((state) => state.filtrosTecnicos);
  const setFiltrosTecnicos = useConfigStore((state) => state.setFiltrosTecnicos);
  const setIndustriaSeleccionada = useConfigStore((state) => state.setIndustriaSeleccionada);
  const setFamiliaSeleccionada = useConfigStore((state) => state.setFamiliaSeleccionada);

  const [filters, setFilters] = useState<FiltrosTecnicosExtendidos>({});
  const [appliedFilters, setAppliedFilters] = useState<FiltrosTecnicosExtendidos>({});
  const [industrias, setIndustrias] = useState<Array<{ id: number; nombre: string; documentId?: string }>>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const initial: FiltrosTecnicosExtendidos = { ...filtrosTecnicosGlobal };
    if (industriaSeleccionada) initial.industriaId = industriaSeleccionada.id;
    setFilters(initial);
    setAppliedFilters(initial);
  }, [modoEntrada, industriaSeleccionada, filtrosTecnicosGlobal]);

  useEffect(() => {
    const loadIndustrias = async () => {
      try {
        const data = await apiService.getIndustrias();
        setIndustrias(data.map((i) => ({ id: i.id, nombre: i.nombre, documentId: i.documentId })));
      } catch (err) {
        console.error(err);
      }
    };
    loadIndustrias();
  }, []);

  useEffect(() => {
    loadFamilias();
  }, [appliedFilters]);

  const loadFamilias = async () => {
    try {
      setLoading(true);
      const industriaDocId =
        appliedFilters.industriaId != null
          ? industrias.find((i) => i.id === appliedFilters.industriaId)?.documentId
          : modoEntrada === 'industria'
            ? industriaSeleccionada?.documentId
            : undefined;
      
      const { industriaId, ...filtrosTecnicos } = appliedFilters;
      
      const data = await apiService.getFamilias({
        industriaDocumentId: industriaDocId,
        filtros: Object.keys(filtrosTecnicos).length > 0 ? filtrosTecnicos : undefined,
      });
      
      setFamilias(data);
      setError(null);
    } catch (err) {
      setError(t('errors.loadFamilies'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectFamilia = (familia: Familia) => {
    setFamiliaSeleccionada(familia);
    onSelect();
  };

  const handleApplyFilters = () => {
    const { industriaId, ...tech } = filters;
    setFiltrosTecnicos(tech);
    if (industriaId != null) {
      const found = industrias.find((i) => i.id === industriaId);
      if (found) setIndustriaSeleccionada({ ...industriaSeleccionada, ...found } as any);
    }
    if (industriaId == null && modoEntrada === 'industria') {
      setIndustriaSeleccionada(null);
    }
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setFiltrosTecnicos({});
    setIndustriaSeleccionada(null);
  };

  const filteredFamilies = useMemo(() => {
    if (!appliedFilters.industriaId) return familias;
    return familias.filter((f) =>
      industriaSeleccionada?.id === appliedFilters.industriaId ||
      industrias.some((i) => i.id === appliedFilters.industriaId && f.industrias?.some?.((fi: any) => fi.id === i.id))
    );
  }, [familias, appliedFilters.industriaId, industrias, industriaSeleccionada]);

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('families.title')}</h2>
        <p className="text-gray-600">{t('families.subtitle')}</p>
      </div>

      {industriaSeleccionada && (
        <div className="p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>{t('families.selectedIndustry')}</strong> {industriaSeleccionada.nombre}
          </p>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      <div className="flex flex-col md:flex-row gap-6">
        <FiltersSidebar
          title={t('filters.title')}
          value={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          industrias={industrias}
        />
        
        <div className="flex-1 min-h-[400px] relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <LoadingSpinner />
            </div>
          )}
          
          {!loading && filteredFamilies.length === 0 && (
            <p className="text-gray-600 text-center py-8">
              {t('families.noResults')}
            </p>
          )}

          {!loading && filteredFamilies.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFamilies.map((familia) => (
                <button
                  key={familia.id}
                  onClick={() => handleSelectFamilia(familia)}
                  className="relative h-80 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition text-left group overflow-hidden bg-gray-100"
                >
                  {familia.imagen?.url && (
                    <img
                      src={familia.imagen.url}
                      alt={familia.nombre}
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 text-white">
                    <h3 className="text-lg font-semibold">
                      {familia.nombre}
                    </h3>
                    {familia.descripcion && (
                      <div
                        className="text-sm text-gray-200 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: familia.descripcion as string }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-start pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {t('buttons.back')}
        </button>
      </div>
    </div>
  );
};
