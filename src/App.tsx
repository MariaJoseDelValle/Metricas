import MenuLateral from "./components/MenuLateral/MenuLateral.tsx";
import BarraSuperior from "./components/BarraSuperior/BarraSuperior.tsx";
import PageDesarrollo from "./components/Desarrollo/PageDesarrollo.tsx";
import PageSistemasInformacion from "./components/SistemasInformacion/PageSistemasInformacion.tsx";
import { useState } from "react";
import {
  type Periodo,
  periodoMesActual,
  type Usuario,
} from "./Services/IndicadoresApi.ts";
import Login from "./components/Login/Login.tsx";
import "./App.css";
import PageProcesos from "./components/Procesos/PageProcesos.tsx";

function App() {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [areaActiva, setAreaActiva] = useState("Desarrollo");
  const [periodo, setPeriodo] = useState<Periodo>(periodoMesActual);
  const [usuario, setUsuario] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  if (!sesionIniciada) {
    return <Login alIniciarSesion={() => setSesionIniciada(true)} />;
  }

  function mostrarPantalla() {
    if (areaActiva === "Desarrollo")
      return (
        <PageDesarrollo
          periodo={periodo}
          usuario={usuario}
          alRecibirUsuarios={setUsuarios}
        />
      );
    if (areaActiva === "Sistemas de Información")
      return (
        <PageSistemasInformacion
          periodo={periodo}
          usuario={usuario}
          alRecibirUsuarios={setUsuarios}
        />
      );

    if (areaActiva === "Procesos")
      return (
        <PageProcesos
          periodo={periodo}
          usuario={usuario}
          alRecibirUsuarios={setUsuarios}
        />
      );
  }
  return (
    <div className="app">
      <MenuLateral
        areaActiva={areaActiva}
        alCambiarArea={(area) => {
          setAreaActiva(area);
          setUsuario(null);
        }}
      />
      <div className="app-principal">
        <BarraSuperior
          periodo={periodo}
          alCambiarPeriodo={setPeriodo}
          usuario={usuario}
          usuarios={usuarios}
          alCambiarUsuario={setUsuario}
        />
        <main className="app-contenido">{mostrarPantalla()}</main>
      </div>
    </div>
  );
}

export default App;
