import { useFlowStore } from '@/store/flow.store';

export const useStepFlow = () => {
  const currentStep = useFlowStore((state) => state.currentStep);
  const previousStep = useFlowStore((state) => state.previousStep);
  const goToStep = useFlowStore((state) => state.goToStep);
  const goBack = useFlowStore((state) => state.goBack);
  const reset = useFlowStore((state) => state.reset);

  return {
    currentStep,
    previousStep,
    goToStep,
    goBack,
    reset,
  };
};
