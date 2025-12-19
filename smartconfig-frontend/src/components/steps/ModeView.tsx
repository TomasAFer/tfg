import { useConfigStore } from '@/store/config.store';
import type { ModoEntrada } from '@/store/config.store';
import type { FlowStep } from '@/types/flow';
import { useTranslation } from '@/hooks/useTranslation';

interface ModeViewProps {
  onSelect: (step: FlowStep) => void;
}

export const ModeView: React.FC<ModeViewProps> = ({ onSelect }) => {
  const setModoEntrada = useConfigStore((state) => state.setModoEntrada);
  const { t } = useTranslation();

  const handleModeSelect = (mode: ModoEntrada) => {
    setModoEntrada(mode);
    const nextStep = mode === 'industria' ? 'INDUSTRY' : 'TECH_FILTERS';
    onSelect(nextStep);
  };

  return (
    <div className="w-full h-full flex items-center justify-center py-12">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('mode.welcome')}
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          {t('mode.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => handleModeSelect('industria')}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-primary-500"
          >
            <div className="text-5xl mb-4">🏭</div>
            <h2 className="text-2xl font-semibold mb-2">{t('mode.byIndustry.title')}</h2>
            <p className="text-gray-600">
              {t('mode.byIndustry.desc')}
            </p>
          </button>

          <button
            onClick={() => handleModeSelect('parametros')}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition border-2 border-transparent hover:border-primary-500"
          >
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="text-2xl font-semibold mb-2">{t('mode.byParameters.title')}</h2>
            <p className="text-gray-600">
              {t('mode.byParameters.desc')}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
