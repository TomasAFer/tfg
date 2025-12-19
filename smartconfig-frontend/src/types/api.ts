export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
}

export interface Industria extends StrapiEntity {
  descripcion: any;
  imagen: any;
  nombre: string;
  slug: string;
}

export interface Familia extends StrapiEntity {
  industrias: any;
  nombre: string;
  slug: string;
  descripcion: any;
  imagen: any;
}

export interface Controladora extends StrapiEntity {
  nombre: string;
  generacion: string;
  precio_lista: string;
  descripcion: string;
  imagen: any;
  ejes_max_soportados: number;
}

export interface Robot extends StrapiEntity {
  modelo: string;
  codigo_modelo: string;
  ejes: number;
  carga_max_kg: number;
  alcance_maximo_mm: number;
  precio_lista: number;
  colaborativo: boolean;
  proteccion: string;
  descripcion: string;
  imagen: any;
  familia: Familia;
  controladora: Controladora;
  industrias: Industria[];
}

export interface CategoriaAccesorio extends StrapiEntity {
  nombre: string;
  slug: string;
}

export interface Accesorio extends StrapiEntity {
  nombre_corto: string;
  precio_lista: number;
  descripcion: string;
  imagen: any;
  categoria_accesorios: CategoriaAccesorio[];
}

export interface RobotAccesorio extends StrapiEntity {
  robot: Robot;
  accesorio_id: Accesorio;
  obligatorio: boolean;
  min_cantidad: number;
  max_cantidad: number;
  notas: string;
}

export interface AccesorioExclusion extends StrapiEntity {
  accesorio_a_id: Accesorio;
  accesorio_b_id: Accesorio;
  motivo: string;
}

export interface FiltrosTecnicos {
  carga_min?: number;
  carga_max?: number;
  alcance_min?: number;
  alcance_max?: number;
  ejes?: number;
  colaborativo?: boolean;
  proteccion?: string;
}
