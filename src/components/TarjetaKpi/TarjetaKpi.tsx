import type { CSSProperties } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { OperadordeMeta, Kpi } from "../../Models/Kpi.ts";

import "./TarjetaKpi.css";

export const simbolos: Record<OperadordeMeta, string> = {
  ">": ">",
  ">=": "≥",
  "<": "<",
  "<=": "≤",
};

function calcularProgreso(
  resultado: number,
  operador: OperadordeMeta,
  meta: number,
): number {
  let progreso: number;
  if (operador === ">" || operador === ">=") {
    progreso = (resultado / meta) * 100;
  } else if (resultado === 0) {
    progreso = 100;
  } else {
    progreso = (meta / resultado) * 100;
  }
  return Math.min(progreso, 100);
}

export function formato(numero: number): string {
  return numero.toLocaleString("es-CO", { maximumFractionDigits: 2 });
}

function TarjetaKpi({ kpi }: { kpi: Kpi }) {
  const { resultado } = kpi;
  const tieneDatos = resultado !== null;
  const cumple = kpi.estado === "cumple";

  const progreso = tieneDatos
    ? calcularProgreso(resultado, kpi.operador, kpi.meta)
    : 0;

  const menorEsMejor = kpi.operador === "<" || kpi.operador === "<=";

  const diferencia = tieneDatos ? Math.abs(resultado - kpi.meta) : 0;
  const unidadDiferencia =
    kpi.unidad === "%" || kpi.unidad.trim() === "/5"
      ? " puntos"
      : ` ${kpi.unidad.trim()}`;
  const textoDiferencia =
    diferencia === 0
      ? "En la meta"
      : cumple
        ? `${formato(diferencia)}${unidadDiferencia} mejor que la meta`
        : `Faltan ${formato(diferencia)}${unidadDiferencia} para la meta`;

  const Icono = kpi.icono;
  const Grafica = kpi.grafica;
  const IconoEstado = cumple ? CheckCircle : XCircle;

  return (
    <article
      className="tarjeta-kpi"
      style={{ "--color-kpi": kpi.color } as CSSProperties}
    >
      <header className="tarjeta-kpi-encabezado">
        <div className="tarjeta-kpi-titulo">
          <span className="tarjeta-kpi-icono">
            <Icono size={18} />
          </span>
          <h3 className="tarjeta-kpi-nombre">{kpi.nombre}</h3>
        </div>
        <span className="tarjeta-kpi-meta">
          Meta: {simbolos[kpi.operador]} {formato(kpi.meta)}
          {kpi.unidad}
          {menorEsMejor && <small>(Menor es mejor)</small>}
        </span>
      </header>

      <div className="tarjeta-kpi-cifras">
        {Grafica ? (
          <Grafica kpi={kpi} />
        ) : (
          <span className="tarjeta-kpi-resultado">
            {tieneDatos ? formato(resultado) : "—"}
            {tieneDatos && (
              <span className={kpi.unidad === "%" ? "" : "tarjeta-kpi-unidad"}>
                {kpi.unidad}
              </span>
            )}
          </span>
        )}
        {tieneDatos ? (
          <span
            className={
              cumple
                ? "tarjeta-kpi-estado cumple"
                : "tarjeta-kpi-estado no-cumple"
            }
          >
            <IconoEstado size={16} />

            {textoDiferencia}
          </span>
        ) : (
          <span className="tarjeta-kpi-estado sin-datos">Sin datos</span>
        )}
      </div>

      <div className="tarjeta-kpi-formula">
        <div className="tarjeta-kpi-formula-encabezado">
          <span>Fórmula de negocio</span>
          <span className="tarjeta-kpi-fuente">{kpi.fuente}</span>
        </div>
        <code>{kpi.formula}</code>
        <p>{kpi.nota}</p>
      </div>
      {kpi.apoyo && (
        <div className="tarjeta-kpi-apoyo">
          <span className="tarjeta-kpi-etiqueta">{kpi.apoyo.etiqueta}</span>
          <strong>{kpi.apoyo.valor}</strong>
        </div>
      )}

      <div className="tarjeta-kpi-progreso">
        <div className="tarjeta-kpi-progreso-texto">
          <span>Avance hacia la Meta</span>
        </div>
        <div className="tarjeta-kpi-barra">
          <div
            className="tarjeta-kpi-barra-relleno"
            style={{ width: `${Math.min(progreso, 100)}%` }}
          />
        </div>
      </div>
    </article>
  );
}

export default TarjetaKpi;
