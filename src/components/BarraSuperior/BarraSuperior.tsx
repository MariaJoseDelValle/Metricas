import "./BarraSuperior.css";
import type { Periodo, Usuario } from "../../Services/IndicadoresApi";
import { CalendarDays, ChevronDown } from "lucide-react";

type BarraSuperiorProps = {
  periodo: Periodo;
  alCambiarPeriodo: (periodo: Periodo) => void;
  usuario: string | null;
  usuarios: Usuario[];
  alCambiarUsuario: (usuario: string | null) => void;
};

function BarraSuperior({
  periodo,
  alCambiarPeriodo,
  usuario,
  usuarios,
  alCambiarUsuario,
}: BarraSuperiorProps) {
  return (
    <header className="barra-superior">
      <div className="filtro" role="group" aria-label="Periodo">
        <span className="filtro-etiqueta">Periodo</span>
        <div className="filtro-campo">
          <CalendarDays size={16} className="filtro-icono" />
          <input
            type="date"
            aria-label="Fecha inicio"
            value={periodo.desde}
            max={periodo.hasta}
            onChange={(e) => {
              if (e.target.value)
                alCambiarPeriodo({ ...periodo, desde: e.target.value });
            }}
          />
          <span className="filtro-fecha">➔</span>

          <input
            type="date"
            aria-label="Fecha fin"
            value={periodo.hasta}
            min={periodo.desde}
            onChange={(e) => {
              if (e.target.value)
                alCambiarPeriodo({ ...periodo, hasta: e.target.value });
            }}
          />
        </div>
      </div>
      <label className="filtro">
        <span className="filtro-etiqueta"> Usuario</span>
        <div className="filtro-campo">
          <select
            value={usuario ?? ""}
            onChange={(e) =>
              alCambiarUsuario(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">Todos</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="filtro-icono filtro-chevron" />
        </div>
      </label>
    </header>
  );
}

export default BarraSuperior;
