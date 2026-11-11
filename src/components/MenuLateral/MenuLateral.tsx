import "./MenuLateral.css";
import { Code, Database, Users, Workflow, MonitorCog } from "lucide-react";
import { NavLink } from "react-router";
const areas = [
  { path: "/desarrollo", label: "Desarrollo", icon: Code },
  { path: "/sistemas", label: "Sistemas de Información", icon: Database },
  { path: "/crm", label: "CRM", icon: Users },
  { path: "/procesos", label: "Procesos", icon: Workflow },
  { path: "/listo", label: "Listo", icon: MonitorCog },
];

function MenuLateral() {
  return (
    <aside className="menu-lateral">
      <div className="menu-lateral-marca">
        <img src="/favicon.svg" alt="" className="menu-lateral-logo" />
        Indicadores TI
      </div>

      <p className="menu-lateral-seccion">Áreas & KPIs</p>
      <ul className="menu-lateral-lista">
        {areas.map((area) => (
          <li key={area.path}>
            <NavLink
              to={area.path}
              className={({ isActive }) =>
                isActive ? "menu-lateral-item activo" : "menu-lateral-item"
              }
            >
              <area.icon size={18} className="menu-lateral-icon" />
              {area.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="menu-lateral-usuario">Maria Jose</div>
    </aside>
  );
}

export default MenuLateral;
