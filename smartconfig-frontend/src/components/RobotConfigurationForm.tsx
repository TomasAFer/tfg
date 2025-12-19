import { useEffect, useState } from 'react';
import { useConfigStore } from '@/store/config.store';
import { apiService } from '@/services/api.service';
import type { Controladora, RobotAccesorio, AccesorioExclusion, Robot } from '@/types/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useTranslation } from '@/hooks/useTranslation';

interface RobotConfigurationFormProps {
  robot: Robot;
  onLoadingChange?: (loading: boolean) => void;
  onErrorChange?: (error: string | null) => void;
  compact?: boolean; // Si true, muestra una versión simplificada
}

export const RobotConfigurationForm: React.FC<RobotConfigurationFormProps> = ({
  robot,
  onLoadingChange,
  onErrorChange,
  compact = false,
}) => {
  const [controladoras, setControladoras] = useState<Controladora[]>([]);
  const [robotAccesorios, setRobotAccesorios] = useState<RobotAccesorio[]>([]);
  const [exclusiones, setExclusiones] = useState<AccesorioExclusion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const controladoraSeleccionada = useConfigStore((state) => state.controladoraSeleccionada);
  const setControladoraSeleccionada = useConfigStore((state) => state.setControladoraSeleccionada);
  const accesoriosSeleccionados = useConfigStore((state) => state.accesoriosSeleccionados);
  const agregarAccesorio = useConfigStore((state) => state.agregarAccesorio);
  const actualizarCantidad = useConfigStore((state) => state.actualizarCantidad);
  const eliminarAccesorio = useConfigStore((state) => state.eliminarAccesorio);
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, [robot.documentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ctrlData, accData, exclData] = await Promise.all([
        apiService.getControladoras(),
        apiService.getAccesoriosByRobot(robot.documentId),
        apiService.getExclusiones(),
      ]);

      setControladoras(ctrlData);
      setRobotAccesorios(accData);
      setExclusiones(exclData);

      if (robot.controladora) {
        setControladoraSeleccionada(robot.controladora);
      } else if (ctrlData.length > 0) {
        setControladoraSeleccionada(ctrlData[0]);
      }

      accData.forEach((ra) => {
        if (ra.obligatorio && ra.accesorio_id) {
          agregarAccesorio(ra.accesorio_id, true);
        }
      });

      onLoadingChange?.(false);
    } catch (err) {
      const errorMsg = t('errors.configLoad');
      setError(errorMsg);
      onErrorChange?.(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAccesorioExcluido = (accesorioId: number): boolean => {
    return accesoriosSeleccionados.some((selected) => {
      return exclusiones.some(
        (excl) =>
          (excl.accesorio_a_id.id === selected.accesorio.id && excl.accesorio_b_id.id === accesorioId) ||
          (excl.accesorio_b_id.id === selected.accesorio.id && excl.accesorio_a_id.id === accesorioId)
      );
    });
  };

  const handleToggleAccesorio = (ra: RobotAccesorio) => {
    if (!ra.accesorio_id) return;

    const isSelected = accesoriosSeleccionados.some((a) => a.accesorio.id === ra.accesorio_id.id);

    if (isSelected) {
      if (!ra.obligatorio) {
        eliminarAccesorio(ra.accesorio_id.id);
      }
    } else {
      if (!isAccesorioExcluido(ra.accesorio_id.id)) {
        agregarAccesorio(ra.accesorio_id, ra.obligatorio);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const obligatorios = robotAccesorios.filter((ra) => ra.obligatorio);
  const opcionales = robotAccesorios.filter((ra) => !ra.obligatorio);

  return (
    <div className="space-y-4">
      {/* Controladora */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('robotConfig.controladora')}</label>
        <select
          value={controladoraSeleccionada?.id || ''}
          onChange={(e) => {
            const ctrl = controladoras.find((c) => c.id === Number(e.target.value));
            if (ctrl) setControladoraSeleccionada(ctrl);
          }}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          {controladoras.map((ctrl) => (
            <option key={ctrl.id} value={ctrl.id}>
              {ctrl.nombre} - {ctrl.generacion}
            </option>
          ))}
        </select>
      </div>

      {/* Accesorios obligatorios */}
      {obligatorios.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            {t('robotConfig.accesoriosOblig')}
          </h4>
          <div className="space-y-2">
            {obligatorios.map((ra) => {
              if (!ra.accesorio_id) return null;
              const selectedItem = accesoriosSeleccionados.find((a) => a.accesorio.id === ra.accesorio_id.id);

              return (
                <div key={ra.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">{ra.accesorio_id.nombre_corto}</h5>
                      {selectedItem && ra.max_cantidad > 1 && (
                        <div className="mt-2 flex items-center space-x-2">
                          <label className="text-xs text-gray-600">{t('robotConfig.cantidad')}</label>
                          <input
                            type="number"
                            min={ra.min_cantidad}
                            max={ra.max_cantidad}
                            value={selectedItem.cantidad || 1}
                            onChange={(e) => actualizarCantidad(ra.accesorio_id.id, Number(e.target.value))}
                            className="w-16 px-2 py-1 border rounded text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accesorios opcionales */}
      {!compact && opcionales.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('robotConfig.accesoriosOpc')}</h4>
          <div className="space-y-2">
            {opcionales.map((ra) => {
              if (!ra.accesorio_id) return null;
              const isSelected = accesoriosSeleccionados.some((a) => a.accesorio.id === ra.accesorio_id.id);
              const isExcluido = isAccesorioExcluido(ra.accesorio_id.id);
              const selectedItem = accesoriosSeleccionados.find((a) => a.accesorio.id === ra.accesorio_id.id);

              return (
                <div
                  key={ra.id}
                  className={`border rounded-lg p-3 ${isExcluido ? 'opacity-50 bg-gray-50' : 'hover:border-primary-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isExcluido}
                          onChange={() => handleToggleAccesorio(ra)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <h5 className="font-semibold text-sm">{ra.accesorio_id.nombre_corto}</h5>
                      </div>

                      {isSelected && ra.max_cantidad > 1 && (
                        <div className="ml-6 mt-2 flex items-center space-x-2">
                          <label className="text-xs text-gray-600">{t('robotConfig.cantidad')}</label>
                          <input
                            type="number"
                            min={ra.min_cantidad}
                            max={ra.max_cantidad}
                            value={selectedItem?.cantidad || 1}
                            onChange={(e) => actualizarCantidad(ra.accesorio_id.id, Number(e.target.value))}
                            className="w-16 px-2 py-1 border rounded text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {robotAccesorios.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-4">
          {t('robotConfig.noAcc')}
        </p>
      )}
    </div>
  );
};
