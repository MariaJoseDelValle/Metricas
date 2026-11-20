import MenuLateral from "./components/MenuLateral/MenuLateral.tsx";
import BarraSuperior from "./components/BarraSuperior/BarraSuperior.tsx";
import PageDesarrollo from "./components/Desarrollo/PageDesarrollo.tsx";
import PageSistemasInformacion from "./components/SistemasInformacion/PageSistemasInformacion.tsx";
import PageListo from "./components/Listo/PageListo.tsx";
import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import {
  type Periodo,
  periodoMesActual,
  type Usuario,
  type Etiqueta,
} from "./Services/IndicadoresApi.ts";

import type { FiltrosPagina } from "./components/Filtros/FiltrosComunes.tsx";

import "./App.css";
import PageProcesos from "./components/Procesos/PageProcesos.tsx";

function App() {
  const [periodo, setPeriodo] = useState<Periodo>(periodoMesActual());
  const [usuario, setUsuario] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [estado, setEstado] = useState<string | null>(null);
  const [etiqueta, setEtiqueta] = useState<string | null>(null);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const { pathname } = useLocation();

  useEffect(() => {
    setUsuario(null);
    setEstado(null);
    setEtiqueta(null);
    setEtiquetas([]);
  }, [pathname]);

  const filtros: FiltrosPagina = {
    periodo,
    usuario,
    alRecibirUsuarios: setUsuarios,
  };

  return (
    <div className="app">
      <MenuLateral />
      <div className="app-principal">
        <BarraSuperior
          periodo={periodo}
          alCambiarPeriodo={setPeriodo}
          usuario={usuario}
          usuarios={usuarios}
          alCambiarUsuario={setUsuario}
          estado={estado}
          alCambiarEstado={setEstado}
          mostrarEstado={pathname === "/listo"}
          etiqueta={etiqueta}
          etiquetas={etiquetas}
          alCambiarEtiqueta={setEtiqueta}
          mostrarEtiqueta={
            pathname === "/desarrollo" || pathname === "/sistemas"
          }
          tituloEtiqueta={pathname === "/sistemas" ? "Etiqueta" : "Proyecto"}
        />
        <main className="app-contenido">
          <Routes>
            <Route
              path="/desarrollo"
              element={
                <PageDesarrollo
                  {...filtros}
                  etiqueta={etiqueta}
                  alRecibirEtiquetas={setEtiquetas}
                />
              }
            />
            <Route
              path="/sistemas"
              element={
                <PageSistemasInformacion
                  {...filtros}
                  etiqueta={etiqueta}
                  alRecibirEtiquetas={setEtiquetas}
                />
              }
            />

            <Route path="/procesos" element={<PageProcesos {...filtros} />} />
            <Route
              path="/listo"
              element={<PageListo {...filtros} estado={estado} />}
            />
            <Route path="/" element={<Navigate to="/desarrollo" replace />} />
            <Route path="*" element={<p>Página no encontrada</p>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
