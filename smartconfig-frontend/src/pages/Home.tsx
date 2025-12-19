import { Layout } from '@/components/Layout';
import { useStepFlow } from '@/hooks/useStepFlow';
import { useConfigStore } from '@/store/config.store';
import { ModeView } from '@/components/steps/ModeView';
import { IndustryView } from '@/components/steps/IndustryView';
import { TechFiltersView } from '@/components/steps/TechFiltersView';
import { FamiliesView } from '@/components/steps/FamiliesView';
import { RobotsView } from '@/components/steps/RobotsView';
import { SummaryView } from '@/components/steps/SummaryView';
import { getBackStep } from '@/types/flow';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export const Home = () => {
  const { currentStep, goToStep, reset } = useStepFlow();
  const resetConfig = useConfigStore((state) => state.resetConfig);
  const modoEntrada = useConfigStore((state) => state.modoEntrada);
  const setLastStepBeforeSummary = useConfigStore(
    (state) => state.setLastStepBeforeSummary
  );
  const lastStepBeforeSummary = useConfigStore(
    (state) => state.lastStepBeforeSummary
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (currentStep === 'MODE') {
      resetConfig();
      reset();
    }
  }, [currentStep, resetConfig, reset]);

  const handleReset = () => {
    if (confirm(t('confirm.reset'))) {
      reset();
      resetConfig();
    }
  };

  const handleBack = () => {
    const backStep = getBackStep(currentStep, {
      modoEntrada,
      lastStepBeforeSummary,
    });
    if (backStep) {
      goToStep(backStep);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'MODE':
        return <ModeView onSelect={goToStep} />;
      case 'INDUSTRY':
        return (
          <IndustryView
            onSelect={() => goToStep('FAMILIES')}
            onBack={handleBack}
          />
        );
      case 'TECH_FILTERS':
        return (
          <TechFiltersView
            onApply={() => goToStep('FAMILIES')}
            onBack={handleBack}
          />
        );
      case 'FAMILIES':
        return (
          <FamiliesView
            onSelect={() => goToStep('ROBOTS')}
            onBack={handleBack}
          />
        );
      case 'ROBOTS':
        return (
          <RobotsView
            onSelect={() => {
              setLastStepBeforeSummary('ROBOTS');
              goToStep('SUMMARY');
            }}
            onBack={handleBack}
          />
        );
      case 'SUMMARY':
        return <SummaryView onBack={handleBack} onClose={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-300px)] flex flex-col">
        {/* Contenedor del paso actual */}
        <div className="flex-1">{renderStep()}</div>
      </div>
    </Layout>
  );
};
