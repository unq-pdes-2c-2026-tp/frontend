import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import "../styles/packages.css";

const packages = [
  {
    id: 2048,
    name: "Escapada a Bariloche",
    description:
      "Una escapada para disfrutar de los lagos, la montaña y la gastronomía patagónica.",
    agency: "Andes Travel",
    hotel: "Hotel Patagonia",
    outboundFlightId: 4512,
    returnFlightId: 4513,
    price: 485000,
    accent: "coral",
  },
  {
    id: 1986,
    name: "Rutas de la Toscana",
    description:
      "Recorrido por pueblos medievales, viñedos y ciudades históricas de Italia.",
    agency: "Mundo Abierto",
    hotel: "Villa Toscana",
    outboundFlightId: 7821,
    returnFlightId: 7822,
    price: 1240000,
    accent: "blue",
  },
  {
    id: 2011,
    name: "Caribe todo incluido",
    description:
      "Descanso frente al mar con alojamiento, comidas y actividades incluidas.",
    agency: "Horizonte Turismo",
    hotel: "Caribe Resort",
    outboundFlightId: 6134,
    returnFlightId: 6135,
    price: 890000,
    accent: "gold",
  },
  {
    id: 2072,
    name: "Aventura en la Patagonia",
    description:
      "Naturaleza, glaciares y excursiones para descubrir el sur argentino.",
    agency: "Andes Travel",
    hotel: "Calafate Lodge",
    outboundFlightId: 5290,
    returnFlightId: 5291,
    price: 620000,
    accent: "green",
  },
  {
    id: 1954,
    name: "Japón esencial",
    description:
      "Una primera visita a Japón combinando la energía de Tokio y la tradición de Kioto.",
    agency: "Mundo Abierto",
    hotel: "Sakura Central Hotel",
    outboundFlightId: 9044,
    returnFlightId: 9045,
    price: 2180000,
    accent: "pink",
  },
];

const Packages = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [agency, setAgency] = useState("Todas las agencias");
  const agencies = [
    "Todas las agencias",
    ...new Set(packages.map((item) => item.agency)),
  ];
  const filteredPackages = useMemo(
    () =>
      packages.filter((item) => {
        const matchesAgency =
          agency === "Todas las agencias" || item.agency === agency;
        const searchableText =
          `${item.name} ${item.description} ${item.agency} ${item.hotel}`.toLowerCase();
        return matchesAgency && searchableText.includes(search.toLowerCase());
      }),
    [agency, search],
  );

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const profileInitials =
    (storedUser.name || storedUser.email || "Usuario")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  return (
    <main className="packages-page">
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
      <section className="page-heading">
        <div>
          <p className="eyebrow">Catálogo de viajes</p>
          <h1>Paquetes</h1>
          <p className="heading-copy">
            Explorá propuestas de nuestras agencias asociadas.
          </p>
        </div>
        <div className="heading-stat">
          <strong>{packages.length}</strong>
          <span>paquetes disponibles</span>
        </div>
      </section>
      <section className="toolbar" aria-label="Filtros de paquetes">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar paquete, hotel o agencia"
          />
        </label>
        <label className="select-field">
          <span>Agencia</span>
          <select
            value={agency}
            onChange={(event) => setAgency(event.target.value)}
          >
            {agencies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>
      <section className="package-list" aria-live="polite">
        <div className="list-header">
          <span>{filteredPackages.length} resultados</span>
          <span>Ordenado por más recientes</span>
        </div>
        {filteredPackages.map((item) => (
          <article className="package-row" key={item.id}>
            <div className={`package-image ${item.accent}`} aria-hidden="true">
              <span>{item.hotel}</span>
            </div>
            <div className="package-info">
              <div className="package-title-line">
                <h2>{item.name}</h2>
              </div>
              <p className="agency">
                <span className="agency-dot">{item.agency.charAt(0)}</span>
                {item.agency}
              </p>
              <p className="package-description">{item.description}</p>
              <div className="package-meta">
                <span>Hotel: {item.hotel}</span>
                <span>Ida: {item.outboundFlightId}</span>
                <span>Vuelta: {item.returnFlightId}</span>
              </div>
            </div>
            <div className="package-price">
              <span>Precio</span>
              <strong>$ {item.price.toLocaleString("es-AR")}</strong>
              <button type="button">
                Ver paquete
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
        {filteredPackages.length === 0 && (
          <div className="empty-state">
            <strong>No encontramos paquetes</strong>
            <span>Probá con otro destino o agencia.</span>
          </div>
        )}
      </section>
    </main>
  );
};

export default Packages;
