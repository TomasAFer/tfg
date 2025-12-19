import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { RobotDetailsModal } from '@/components/RobotDetailsModal';
import { FiltersSidebar, type FiltrosTecnicosExtendidos } from '@/components/FiltersSidebar';
import { useConfigStore } from '@/store/config.store';
import { apiService } from '@/services/api.service';
import type { Robot } from '@/types/api';
import { useTranslation } from '@/hooks/useTranslation';

interface RobotsViewProps {
  onSelect: () => void;
  onBack: () => void;
}

export const RobotsView: React.FC<RobotsViewProps> = ({ onSelect, onBack }) => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);

  const familiaSeleccionada = useConfigStore((state) => state.familiaSeleccionada);
  const industriaSeleccionada = useConfigStore((state) => state.industriaSeleccionada);
  const filtrosTecnicos = useConfigStore((state) => state.filtrosTecnicos);
  const setRobotSeleccionado = useConfigStore((state) => state.setRobotSeleccionado);
  const language = useConfigStore((state) => state.language);

  const [filters, setFilters] = useState<FiltrosTecnicosExtendidos>({});
  const [appliedFilters, setAppliedFilters] = useState<FiltrosTecnicosExtendidos>({});
  const [industrias, setIndustrias] = useState<Array<{ id: number; nombre: string; documentId?: string }>>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const initial: FiltrosTecnicosExtendidos = { ...filtrosTecnicos };
    if (industriaSeleccionada) initial.industriaId = industriaSeleccionada.id;
    setFilters(initial);
    setAppliedFilters(initial);
  }, [industriaSeleccionada, filtrosTecnicos, language]);

  useEffect(() => {
    setAppliedFilters(filters);
  }, [filters]);

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
    loadRobots();
  }, [appliedFilters, language]); 

  const loadRobots = async () => {
    try {
      setLoading(true);
      setError(null);

      const industriaDocId =
        appliedFilters.industriaId != null
          ? industrias.find((i) => i.id === appliedFilters.industriaId)?.documentId
          : industriaSeleccionada?.documentId;

      const { industriaId, ...filtrosTecnicos } = appliedFilters;

      const data = await apiService.getRobots({
        familiaDocumentId: familiaSeleccionada?.documentId,
        industriaDocumentId: industriaDocId,
        filtros: Object.keys(filtrosTecnicos).length > 0 ? filtrosTecnicos : undefined,
      });

      setRobots(data);
    } catch (err) {
      setError(t('robots.loadError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setAppliedFilters({});
  };

  const handleOpenModal = (robot: Robot) => {
    setSelectedRobot(robot);
    setRobotSeleccionado(robot);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRobot(null);
  };

  const handleAddToSummary = () => {
    handleCloseModal();
  };

  const handleContinueConfiguration = () => {
    handleCloseModal();
    onSelect(); 
  };

  return (
    <div className="w-full space-y-6">
      {/* Título general */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('robots.title')}</h2>
        <p className="text-gray-600">{t('robots.subtitle')}</p>
      </div>

      {/* Cabecera de familia */}
      {familiaSeleccionada && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 p-6">
            {/* Imagen de la familia */}
            {familiaSeleccionada.imagen?.url && (
              <div className="md:w-1/3 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[200px]">
                <img
                  src={familiaSeleccionada.imagen.url}
                  alt={familiaSeleccionada.nombre}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            )}

            {/* Información de la familia */}
            <div className={`${familiaSeleccionada.imagen?.url ? 'md:w-2/3' : 'w-full'}`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{familiaSeleccionada.nombre}</h3>
              {familiaSeleccionada.descripcion && (
                <div
                  className="text-gray-600 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: familiaSeleccionada.descripcion }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Sección con filtros y grid de robots */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtros */}
        <FiltersSidebar
          title={t('filters.modelsTitle')}
          value={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          industrias={industrias}
        />

        {/* Grid de robots */}
        <div className="flex-1 min-h-[400px] relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <LoadingSpinner />
            </div>
          )}

          {!loading && robots.length === 0 && (
            <p className="text-gray-600 text-center py-12">
              {t('robots.noResults')}
            </p>
          )}

          {!loading && robots.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {robots.map((robot) => (
                <button
                  key={robot.id}
                  onClick={() => handleOpenModal(robot)}
                  className="relative h-80 border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:shadow-lg transition text-left group overflow-hidden bg-gray-100"
                >
                  {robot.imagen?.url && (
                    <img
                      src={robot.imagen.url}
                      alt={robot.modelo}
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  {robot.colaborativo && (
                    <span className="absolute top-3 right-3 bg-green-100 text-green-900 text-xs px-3 py-1 rounded-full font-semibold shadow-sm z-10">
                      {t('robots.collaborativeTag')}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 text-white">
                    <h3 className="text-lg font-semibold">{robot.modelo}</h3>
                    <div className="text-sm text-gray-200 space-y-1">
                      <p><strong>{t('robots.axes')}:</strong> {robot.ejes}</p>
                      <p><strong>{t('robots.payload')}:</strong> {robot.carga_max_kg} {t('units.kg')}</p>
                      <p><strong>{t('robots.reach')}:</strong> {robot.alcance_maximo_mm} {t('units.mm')}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles y configuración del robot */}
      <RobotDetailsModal
        open={modalOpen}
        robot={selectedRobot}
        onClose={handleCloseModal}
        onAddToSummary={handleAddToSummary}
        onContinueConfiguration={handleContinueConfiguration}
      />

      {/* Navegación */}
      <div className="flex justify-start pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          {t('buttons.back')}
        </button>
      </div>
    </div>
  );
};
