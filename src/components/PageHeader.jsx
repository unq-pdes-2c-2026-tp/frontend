import { useLocation, useNavigate } from "react-router";
import { getStoredUser, storeLogout } from "../store/local";
import { USER_TYPE_MAP } from "../constants";
import { ROUTES } from "../routes/constants";
import { Button } from "react-bootstrap";
import { logout } from "../api/auth";


function getLinks() {
  const user = getStoredUser()
  console.log(user);
  if (!user)
    return []

  const commonLinks = [
    {
      label: "Perfil",
      path: ROUTES.PROFILE
    }
  ]

  if (user.user_type.toString() === USER_TYPE_MAP.END_USER) {
    return [
      {
        label: "Paquetes",
        path: ROUTES.PACKAGES
      },
      {
        label: "Agencias",
        path: ROUTES.AGENCIES
      },
      ...commonLinks
    ]
  }

  if (user.user_type.toString() === USER_TYPE_MAP.ADMIN) {
    return [
      {
        label: "Agencias",
        path: ROUTES.ADMIN_AGENCIES
      },
      ...commonLinks
    ]
  }
  return []
}

export function PageHeader() {
  const navigate = useNavigate();
  const storedUser = getStoredUser()
  const profileInitials =
  (storedUser?.name || storedUser?.email || "Usuario")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  const doLogout = ()=>{
    logout().then(()=>{
      storeLogout()
      navigate("/", {replace: true})
    })
  }


  return (
  <header className="topbar">
        <a
          className="brand"
          href="/"
          aria-label="Comprá tu Viaje, inicio"
        >
          <span className="brand-mark">CTV</span>
          <span>Comprá tu Viaje</span>
        </a>
        <nav aria-label="Navegación principal">
          {getLinks().map(link  => <Link key={link.path} label={link.label} path={link.path} />)}
        </nav>
        <button
          className="profile-button"
          type="button"
          aria-label="Abrir perfil"
          onClick={() => navigate(ROUTES.PROFILE)}
        >
          {profileInitials}
        </button>
        <Button variant="outline-danger" size="sm" onClick={doLogout} >Cerrar sesión</Button>
      </header>
  );
}

function Link({label, path}) {
  const location = useLocation()
  const active = location.pathname === path
  const className = active ? "nav-link active" : "nav-link"
  return (
    <a className={className} href={path}>
      {label}
    </a>
  )
}