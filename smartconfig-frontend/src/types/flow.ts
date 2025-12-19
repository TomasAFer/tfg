export type FlowStep =
  | 'MODE'
  | 'INDUSTRY'
  | 'TECH_FILTERS'
  | 'FAMILIES'
  | 'ROBOTS'
  | 'CONFIGURATION'
  | 'SUMMARY';

export interface ModalConfig {
  isOpen: boolean;
  step: FlowStep | null;
  canGoBack: boolean;
  onBack?: () => void;
}

export interface FlowContext {
  modoEntrada: 'industria' | 'parametros' | null;
  lastStepBeforeSummary?: FlowStep | null;
}

export const getBackStep = (currentStep: FlowStep, context: FlowContext): FlowStep | null => {
  switch (currentStep) {
    case 'MODE':
      return null;
    case 'INDUSTRY':
      return 'MODE';
    case 'TECH_FILTERS':
      return 'MODE';
    case 'FAMILIES':
      return context.modoEntrada === 'industria' ? 'INDUSTRY' : 'TECH_FILTERS';
    case 'ROBOTS':
      return 'FAMILIES';
    case 'CONFIGURATION':
      return 'ROBOTS';
    case 'SUMMARY':
      return context.lastStepBeforeSummary || 'ROBOTS';
    default:
      return null;
  }
};
