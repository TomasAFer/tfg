import apiClient from '@/lib/api-client';
import { useConfigStore } from '@/store/config.store';
import type {
  StrapiResponse,
  Industria,
  Familia,
  Robot,
  Controladora,
  Accesorio,
  RobotAccesorio,
  AccesorioExclusion,
  FiltrosTecnicos,
} from '@/types/api';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const withAbsoluteUrl = (media: any) => {
  if (!media?.url) return media;
  if (media.url.startsWith('http')) return media;
  return { ...media, url: `${STRAPI_URL}${media.url}` };
};

class ApiService {
  // Industrias
  async getIndustrias(): Promise<Industria[]> {
    const locale = useConfigStore.getState().language;
    const response = await apiClient.get<StrapiResponse<Industria[]>>(
      `/industrias?populate=*&locale=${locale}&publicationState=live`
    );
    return response.data.data.map((item) => ({
      ...item,
      imagen: withAbsoluteUrl(item.imagen),
    }));
  }

  // Familias
  async getFamilias(params?: {
    industriaDocumentId?: string;
    filtros?: FiltrosTecnicos;
  }): Promise<Familia[]> {
    const locale = useConfigStore.getState().language;
    let url = `/familias?populate=*&locale=${locale}&publicationState=live`;
    
    if (params?.industriaDocumentId) {
      url += `&filters[robots][industrias][documentId][$eq]=${params.industriaDocumentId}`;
    }
    
    // Aplicar filtros técnicos a los robots de la familia
    if (params?.filtros) {
      const f = params.filtros;
      if (f.carga_min) url += `&filters[robots][carga_max_kg][$gte]=${f.carga_min}`;
      if (f.carga_max) url += `&filters[robots][carga_max_kg][$lte]=${f.carga_max}`;
      if (f.alcance_min) url += `&filters[robots][alcance_maximo_mm][$gte]=${f.alcance_min}`;
      if (f.alcance_max) url += `&filters[robots][alcance_maximo_mm][$lte]=${f.alcance_max}`;
      if (f.ejes) url += `&filters[robots][ejes][$eq]=${f.ejes}`;
      if (f.colaborativo !== undefined) url += `&filters[robots][colaborativo][$eq]=${f.colaborativo}`;
      if (f.proteccion) url += `&filters[robots][proteccion][$eq]=${f.proteccion}`;
    }
    
    const response = await apiClient.get<StrapiResponse<Familia[]>>(url);
    return response.data.data.map((item) => ({
      ...item,
      imagen: withAbsoluteUrl(item.imagen),
    }));
  }

  // Robots
  async getRobots(params?: {
    familiaDocumentId?: string;
    industriaDocumentId?: string;
    filtros?: FiltrosTecnicos;
  }): Promise<Robot[]> {
    const locale = useConfigStore.getState().language;
    let url = `/robots?populate=*&locale=${locale}&publicationState=live`;
    if (params?.familiaDocumentId) {
      url += `&filters[familia][documentId][$eq]=${params.familiaDocumentId}`;
    }
    if (params?.industriaDocumentId) {
      url += `&filters[industrias][documentId][$eq]=${params.industriaDocumentId}`;
    }
    if (params?.filtros) {
      const f = params.filtros;
      if (f.carga_min) url += `&filters[carga_max_kg][$gte]=${f.carga_min}`;
      if (f.carga_max) url += `&filters[carga_max_kg][$lte]=${f.carga_max}`;
      if (f.alcance_min) url += `&filters[alcance_maximo_mm][$gte]=${f.alcance_min}`;
      if (f.alcance_max) url += `&filters[alcance_maximo_mm][$lte]=${f.alcance_max}`;
      if (f.ejes) url += `&filters[ejes][$eq]=${f.ejes}`;
      if (f.colaborativo !== undefined) url += `&filters[colaborativo][$eq]=${f.colaborativo}`;
      if (f.proteccion) url += `&filters[proteccion][$eq]=${f.proteccion}`;
    }
    const response = await apiClient.get<StrapiResponse<Robot[]>>(url);
    return response.data.data.map((item) => ({
      ...item,
      imagen: withAbsoluteUrl(item.imagen),
    }));
  }

  async getRobotById(id: string): Promise<Robot> {
    const locale = useConfigStore.getState().language;
    const response = await apiClient.get<StrapiResponse<Robot>>(
      `/robots/${id}?populate=*&locale=${locale}&publicationState=live`
    );
    return {
      ...response.data.data,
      imagen: withAbsoluteUrl(response.data.data.imagen),
    };
  }

  // Controladoras
  async getControladoras(): Promise<Controladora[]> {
    const locale = useConfigStore.getState().language;
    const response = await apiClient.get<StrapiResponse<Controladora[]>>(
      `/controladoras?populate=*&locale=${locale}&publicationState=live`
    );
    return response.data.data.map((item) => ({
      ...item,
      imagen: withAbsoluteUrl(item.imagen),
    }));
  }

  // Accesorios
  async getAccesoriosByRobot(robotId: string): Promise<RobotAccesorio[]> {
    const locale = useConfigStore.getState().language;
    const response = await apiClient.get<StrapiResponse<RobotAccesorio[]>>(
      `/robot-accesorios?filters[robot][documentId][$eq]=${robotId}&populate[accesorio_id][populate]=*&populate[robot][populate]=*&locale=${locale}&publicationState=live`
    );
    return response.data.data.map((item) => ({
      ...item,
      accesorio_id: item.accesorio_id
        ? { ...item.accesorio_id, imagen: withAbsoluteUrl(item.accesorio_id.imagen) }
        : item.accesorio_id,
    }));
  }

  async getAccesorios(): Promise<Accesorio[]> {
    const locale = useConfigStore.getState().language;
    const response = await apiClient.get<StrapiResponse<Accesorio[]>>(
      `/accesorios?populate=*&locale=${locale}&publicationState=live`
    );
    return response.data.data.map((item) => ({
      ...item,
      imagen: withAbsoluteUrl(item.imagen),
    }));
  }

  // Exclusiones
  async getExclusiones(): Promise<AccesorioExclusion[]> {
    const locale = useConfigStore.getState().language;
    const response = await apiClient.get<StrapiResponse<AccesorioExclusion[]>>(
      `/accesorio-exclusions?populate[accesorio_a_id][populate]=*&populate[accesorio_b_id][populate]=*&locale=${locale}&publicationState=live`
    );
    return response.data.data;
  }

  // Enviar solicitud de contacto
  async enviarSolicitud(data: any): Promise<any> {
    const payload = {
      nombre: data.nombre,
      empresa: data.empresa,
      email: data.email,
      telefono: data.telefono ?? null,
      comentario: data.comentario ?? null,
      configuracion_robots: data.configuracion_robots ?? [],
      precio_total: data.precio_total ?? null,
      estado: 'pendiente',
    };

    const response = await apiClient.post('/solicitud-contacto', {
      data: payload,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
