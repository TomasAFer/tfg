import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFlowStore } from '@/store/flow.store';
import type { FlowStep } from '@/types/flow';

export const useURLSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentStep, goToStep } = useFlowStore();

  // Read from URL on mount
  useEffect(() => {
    const stepParam = searchParams.get('step') as FlowStep | null;
    if (stepParam && currentStep !== stepParam) {
      goToStep(stepParam);
    }
  }, []);

  // Write to URL when step changes
  useEffect(() => {
    if (currentStep) {
      setSearchParams({ step: currentStep }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [currentStep]);
};