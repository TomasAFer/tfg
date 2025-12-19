import { create } from 'zustand';
import type { Robot, Controladora, Accesorio, Familia, Industria } from '@/types/api';
import { FlowStep } from '@/types/flow';

export type ModoEntrada = 'industria' | 'parametros';
export type Language = 'es' | 'en';

export interface AccesorioSeleccionado {
  accesorio: Accesorio;
  obligatorio: boolean;
  cantidad: number;
}

export interface SummaryItem {
  robot: Robot;
  controladora: Controladora | null;
  accesorios: AccesorioSeleccionado[];
}

interface ConfigState {
  // Flujo de selección
  modoEntrada: ModoEntrada | null;
  industriaSeleccionada: Industria | null;
  familiaSeleccionada: Familia | null;
  robotSeleccionado: Robot | null;
  controladoraSeleccionada: Controladora | null;
  accesoriosSeleccionados: AccesorioSeleccionado[];
  filtrosTecnicos: Record<string, any>;
  lastStepBeforeSummary: FlowStep | null;
  language: Language;

  // Summary/Carrito
  summaryItems: SummaryItem[];

  // Acciones
  setModoEntrada: (modo: ModoEntrada) => void;
  setIndustriaSeleccionada: (industria: Industria | null) => void;
  setFamiliaSeleccionada: (familia: Familia | null) => void;
  setRobotSeleccionado: (robot: Robot | null) => void;
  setControladoraSeleccionada: (controladora: Controladora | null) => void;
  setFiltrosTecnicos: (filtros: Record<string, any>) => void;
  agregarAccesorio: (accesorio: Accesorio, obligatorio: boolean) => void;
  actualizarCantidad: (accesorioId: number, cantidad: number) => void;
  eliminarAccesorio: (accesorioId: number) => void;
  
  // Summary actions
  agregarAlResumen: (item: SummaryItem) => void;
  eliminarDelResumen: (index: number) => void;
  vaciarResumen: () => void;
  
  getPrecioTotal: () => number;
  resetConfig: () => void;
  resetSelections: () => void;
  setLastStepBeforeSummary: (step: FlowStep | null) => void;
  setLanguage: (lang: Language) => void;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  modoEntrada: null,
  industriaSeleccionada: null,
  familiaSeleccionada: null,
  robotSeleccionado: null,
  controladoraSeleccionada: null,
  accesoriosSeleccionados: [],
  filtrosTecnicos: {},
  summaryItems: [],
  lastStepBeforeSummary: null,
  language: 'es',

  setModoEntrada: (modo) => set({ modoEntrada: modo }),
  setIndustriaSeleccionada: (industria) => set({ industriaSeleccionada: industria }),
  setFamiliaSeleccionada: (familia) => set({ familiaSeleccionada: familia }),
  setRobotSeleccionado: (robot) => set({ robotSeleccionado: robot }),
  setControladoraSeleccionada: (controladora) => set({ controladoraSeleccionada: controladora }),
  setFiltrosTecnicos: (filtros) => set({ filtrosTecnicos: filtros }),

  agregarAccesorio: (accesorio, obligatorio) =>
    set((state) => {
      const existe = state.accesoriosSeleccionados.find((a) => a.accesorio.id === accesorio.id);
      if (existe) return state;
      return {
        accesoriosSeleccionados: [
          ...state.accesoriosSeleccionados,
          { accesorio, obligatorio, cantidad: 1 },
        ],
      };
    }),

  actualizarCantidad: (accesorioId, cantidad) =>
    set((state) => ({
      accesoriosSeleccionados: state.accesoriosSeleccionados.map((a) =>
        a.accesorio.id === accesorioId ? { ...a, cantidad } : a
      ),
    })),

  eliminarAccesorio: (accesorioId) =>
    set((state) => ({
      accesoriosSeleccionados: state.accesoriosSeleccionados.filter(
        (a) => a.accesorio.id !== accesorioId
      ),
    })),

  agregarAlResumen: (item) =>
    set((state) => ({
      summaryItems: [...state.summaryItems, item],
    })),

  eliminarDelResumen: (index) =>
    set((state) => ({
      summaryItems: state.summaryItems.filter((_, i) => i !== index),
    })),

  vaciarResumen: () => set({ summaryItems: [] }),

  getPrecioTotal: () => {
    const state = get();
    let total = 0;

    state.summaryItems.forEach((item) => {
      if (item.robot.precio_lista) total += item.robot.precio_lista;
      if (item.controladora?.precio_lista) total += Number(item.controladora.precio_lista);
      item.accesorios.forEach((acc) => {
        if (acc.accesorio.precio_lista) total += acc.accesorio.precio_lista * acc.cantidad;
      });
    });

    return total;
  },

  setLastStepBeforeSummary: (step) => set({ lastStepBeforeSummary: step }),
  setLanguage: (language) => set({ language }),

  resetConfig: () =>
    set((state) => ({
      modoEntrada: null,
      industriaSeleccionada: null,
      familiaSeleccionada: null,
      robotSeleccionado: null,
      controladoraSeleccionada: null,
      accesoriosSeleccionados: [],
      filtrosTecnicos: {},
      summaryItems: [],
      lastStepBeforeSummary: null,
      language: state.language, // Preservar idioma actual
    })),

  resetSelections: () =>
    set({
      modoEntrada: null,
      industriaSeleccionada: null,
      familiaSeleccionada: null,
      robotSeleccionado: null,
      controladoraSeleccionada: null,
      accesoriosSeleccionados: [],
      filtrosTecnicos: {},
      lastStepBeforeSummary: null,
      language: 'es',
    }),
}));
