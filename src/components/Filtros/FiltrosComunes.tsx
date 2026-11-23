import { CalendarDays, ChevronDown } from "lucide-react";
import type { Periodo, Usuario } from "../../Services/IndicadoresApi.ts";

export type FiltrosPagina = {
  periodo: Periodo;
  usuario: string | null;
  alRecibirUsuarios: (usuarios: Usuario[]) => void;
};

type FiltrosComunesProps = {
  periodo: Periodo;
  alCambiarPeriodo: (periodo: Periodo) => void;
  usuario: string | null;
  usuarios: Usuario[];
  alCambiarUsuario: (usuario: string | null) => void;
};

// Filtros que muestran todas las áreas en la barra superior.
function FiltrosComunes({
  periodo,
  alCambiarPeriodo,
  usuario,
  usuarios,
  alCambiarUsuario,
}: FiltrosComunesProps) {
  return (
    <>
      <FiltroPeriodo periodo={periodo} alCambiarPeriodo={alCambiarPeriodo} />
      <FiltroUsuario
        usuario={usuario}
        usuarios={usuarios}
        alCambiarUsuario={alCambiarUsuario}
      />
    </>
  );
}

function FiltroPeriodo({
  periodo,
  alCambiarPeriodo,
}: Pick<FiltrosComunesProps, "periodo" | "alCambiarPeriodo">) {
  return (
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
  );
}

function FiltroUsuario({
  usuario,
  usuarios,
  alCambiarUsuario,
}: Pick<FiltrosComunesProps, "usuario" | "usuarios" | "alCambiarUsuario">) {
  return (
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
  );
}

export default FiltrosComunes;
