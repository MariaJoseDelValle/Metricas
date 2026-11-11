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
} from "./Services/IndicadoresApi.ts";

import "./App.css";
import PageProcesos from "./components/Procesos/PageProcesos.tsx";

function App() {
  const [periodo, setPeriodo] = useState<Periodo>(periodoMesActual());
  const [usuario, setUsuario] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const { pathname } = useLocation();

  useEffect(() => {
    setUsuario(null);
  }, [pathname]);
  const props = { periodo, usuario, alRecibirUsuarios: setUsuarios };

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
        />
        <main className="app-contenido">
          <Routes>
            <Route path="/desarrollo" element={<PageDesarrollo {...props} />} />
            <Route
              path="/sistemas"
              element={<PageSistemasInformacion {...props} />}
            />
            <Route path="/crm" element={<p> Próximamente</p>} />

            <Route path="/procesos" element={<PageProcesos {...props} />} />
            <Route path="/listo" element={<PageListo {...props} />} />
            <Route path="/" element={<Navigate to="/desarrollo" replace />} />
            <Route path="*" element={<p>Página no encontrada</p>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
