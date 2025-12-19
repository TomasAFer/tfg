import { create } from 'zustand';
import type { FlowStep } from '@/types/flow';

interface FlowState {
  currentStep: FlowStep;
  previousStep: FlowStep | null;
  isModalOpen: boolean;

  setCurrentStep: (step: FlowStep) => void;
  setPreviousStep: (step: FlowStep | null) => void;
  goToStep: (step: FlowStep) => void;
  goBack: () => void;
  reset: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  currentStep: 'MODE',
  previousStep: null,
  isModalOpen: false,

  setCurrentStep: (step) => set({ currentStep: step }),
  setPreviousStep: (step) => set({ previousStep: step }),

  goToStep: (step) => {
    const state = get();
    if (state.currentStep !== step) {
      set({ previousStep: state.currentStep, currentStep: step });
    }
  },

  goBack: () => {
    set((state) => {
      if (state.previousStep) {
        return { currentStep: state.previousStep, previousStep: null };
      }
      return state;
    });
  },

  reset: () => set({ currentStep: 'MODE', previousStep: null }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
