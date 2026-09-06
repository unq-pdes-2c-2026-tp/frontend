import { useNavigate } from "react-router";
import { getStoredUser } from "../api/ApiRequests";


export function PageHeader() {
  const navigate = useNavigate();
  const storedUser = getStoredUser()
  const profileInitials =
  (storedUser.name || storedUser.email || "Usuario")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("") || "U";
  return (
  <header className="topbar">
        <a
          className="brand"
          href="/packages"
          aria-label="Comprá tu Viaje, inicio"
        >
          <span className="brand-mark">CTV</span>
          <span>Comprá tu Viaje</span>
        </a>
        <nav aria-label="Navegación principal">
          <a className="nav-link active" href="/packages">
            Paquetes
          </a>
          <a className="nav-link" href="/agencias">
            Agencias
          </a>
        </nav>
        <button
          className="profile-button"
          type="button"
          aria-label="Abrir perfil"
          onClick={() => navigate("/profile")}
        >
          {profileInitials}
        </button>
      </header>
  );
}
