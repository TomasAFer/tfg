import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useConfigStore } from '@/store/config.store';
import { apiService } from '@/services/api.service';
import type { Industria } from '@/types/api';
import { useTranslation } from '@/hooks/useTranslation';

interface IndustryViewProps {
  onSelect: () => void;
  onBack: () => void;
}

export const IndustryView: React.FC<IndustryViewProps> = ({ onSelect, onBack }) => {
  const [industrias, setIndustrias] = useState<Industria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIndustriaSeleccionada = useConfigStore((state) => state.setIndustriaSeleccionada);
  const { t } = useTranslation();

  useEffect(() => {
    loadIndustrias();
  }, []);

  const loadIndustrias = async () => {
    try {
      setLoading(true);
      const data = await apiService.getIndustrias();
      setIndustrias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las industrias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIndustria = (industria: Industria) => {
    setIndustriaSeleccionada(industria);
    onSelect();
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('industry.title')}</h2>
        <p className="text-gray-600">{t('industry.subtitle')}</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <LoadingSpinner />
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industrias.map((industria) => (
              <button
                key={industria.id}
                onClick={() => handleSelectIndustria(industria)}
                className="relative h-80 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition text-left group overflow-hidden bg-gray-100"
              >
                {industria.imagen?.url && (
                  <img
                    src={industria.imagen.url}
                    alt={industria.nombre}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 text-white">
                  <h3 className="text-lg font-semibold">
                    {industria.nombre}
                  </h3>
                  {industria.descripcion && (
                    <div
                      className="text-sm text-gray-200 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: industria.descripcion as string }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
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
