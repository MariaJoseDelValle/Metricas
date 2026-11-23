import "./BarraSuperior.css";
import {
  type Periodo,
  type Usuario,
  type Etiqueta,
  ESTADOS_TICKET,
} from "../../Services/IndicadoresApi";
import { ChevronDown } from "lucide-react";
import FiltrosComunes from "../Filtros/FiltrosComunes.tsx";

type BarraSuperiorProps = {
  periodo: Periodo;
  alCambiarPeriodo: (periodo: Periodo) => void;
  usuario: string | null;
  usuarios: Usuario[];
  alCambiarUsuario: (usuario: string | null) => void;
  estado: string | null;
  alCambiarEstado: (estado: string | null) => void;
  mostrarEstado: boolean;
  etiqueta: string | null;
  etiquetas: Etiqueta[];
  alCambiarEtiqueta: (etiqueta: string | null) => void;
  mostrarEtiqueta: boolean;
  tituloEtiqueta: string;
};

function BarraSuperior({
  periodo,
  alCambiarPeriodo,
  usuario,
  usuarios,
  alCambiarUsuario,
  estado,
  alCambiarEstado,
  mostrarEstado,
  etiqueta,
  etiquetas,
  alCambiarEtiqueta,
  mostrarEtiqueta,
  tituloEtiqueta,
}: BarraSuperiorProps) {
  return (
    <header className="barra-superior">
      <FiltrosComunes
        periodo={periodo}
        alCambiarPeriodo={alCambiarPeriodo}
        usuario={usuario}
        usuarios={usuarios}
        alCambiarUsuario={alCambiarUsuario}
      />
      {mostrarEstado && (
        <label className="filtro">
          <span className="filtro-etiqueta"> Estado</span>
          <div className="filtro-campo">
            <select
              value={estado ?? ""}
              onChange={(e) =>
                alCambiarEstado(e.target.value === "" ? null : e.target.value)
              }
            >
              <option value="">Todos</option>
              {ESTADOS_TICKET.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>

            <ChevronDown size={16} className="filtro-icono filtro-chevron" />
          </div>
        </label>
      )}
      {mostrarEtiqueta && (
        <label className="filtro">
          <span className="filtro-etiqueta"> {tituloEtiqueta}</span>
          <div className="filtro-campo">
            <select
              value={etiqueta ?? ""}
              onChange={(e) =>
                alCambiarEtiqueta(e.target.value === "" ? null : e.target.value)
              }
            >
              <option value="">Todos</option>
              {etiquetas.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.nombre}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="filtro-icono filtro-chevron" />
          </div>
        </label>
      )}
    </header>
  );
}

export default BarraSuperior;
