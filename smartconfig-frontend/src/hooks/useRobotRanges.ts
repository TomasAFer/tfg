import { useEffect, useState } from 'react';
import { apiService } from '@/services/api.service';

export interface RobotRanges {
  carga: { min: number; max: number };
  alcance: { min: number; max: number };
  protecciones: string[];
}

export const useRobotRanges = (industriaDocumentId?: string) => {
  const [ranges, setRanges] = useState<RobotRanges>({
    carga: { min: 0, max: 100 },
    alcance: { min: 0, max: 5000 },
    protecciones: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRanges = async () => {
      try {
        setLoading(true);
        const robots = await apiService.getRobots({
          industriaDocumentId,
        });

        if (robots.length > 0) {
          const cargas = robots.map(r => r.carga_max_kg).filter(c => c != null);
          const alcances = robots.map(r => r.alcance_maximo_mm).filter(a => a != null);
          const protecciones = [...new Set(
            robots.map(r => r.proteccion).filter(p => p != null && p !== '')
          )].sort();

          setRanges({
            carga: {
              min: Math.floor(Math.min(...cargas)),
              max: Math.ceil(Math.max(...cargas)),
            },
            alcance: {
              min: Math.floor(Math.min(...alcances) / 50) * 50,
              max: Math.ceil(Math.max(...alcances) / 50) * 50,
            },
            protecciones: protecciones as string[],
          });
        }
      } catch (error) {
        console.error('Error loading robot ranges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRanges();
  }, [industriaDocumentId]);

  return { ranges, loading };
};
