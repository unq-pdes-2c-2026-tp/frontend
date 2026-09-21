import { useEffect, useMemo, useState } from "react";
import "../styles/packages.css";
import { Page } from "./Page";
import { asMoney } from "../format-utils/money";
import { getPackages } from "../api/packages";

const formatFlightDate = (value) => {
  if (!value) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
};

const Packages = () => {
  const [search, setSearch] = useState("");
  const [agency, setAgency] = useState("Todas las agencias");
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getPackages().then(({ data }) => setPackages(data)).catch(() => setError("No se pudieron cargar los paquetes."));
  }, []);
  const agencies = [
    "Todas las agencias",
    ...new Set(packages.map((item) => item.agency_name)),
  ];
  const filteredPackages = useMemo(
    () =>
      packages.filter((item) => {
        const matchesAgency =
          agency === "Todas las agencias" || item.agency_name === agency;
        const searchableText =
          `${item.name} ${item.description} ${item.agency_name} ${item.hotel_name}`.toLowerCase();
        return matchesAgency && searchableText.includes(search.toLowerCase());
      }),
    [agency, search, packages],
  );

  return (
    <Page>
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
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="list-header">
          <span>{filteredPackages.length} resultados</span>
          <span>Ordenado por más recientes</span>
        </div>
        {filteredPackages.map((item) => (
          <article className="package-row" key={item.id}>
            <div className="package-image coral">
              {item.hotel_photo ? (
                <img src={item.hotel_photo} alt={item.hotel_name} />
              ) : (
                <span>{item.hotel_name}</span>
              )}
            </div>
            <div className="package-info">
              <div className="package-title-line">
                <h2>{item.name}</h2>
              </div>
              <p className="agency">
                <span className="agency-dot">{item.agency_name?.charAt(0)}</span>
                {item.agency_name}
              </p>
              <p className="package-description">{item.description}</p>
              <div className="package-meta">
                <span>Hotel: {item.hotel_name}</span>
                <span>Ida: {formatFlightDate(item.outbound_flight_date)}</span>
                <span>Vuelta: {formatFlightDate(item.return_flight_date)}</span>
              </div>
            </div>
            <div className="package-price">
              <span>Precio</span>
              <strong>{asMoney(item.price)}</strong>
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
    </Page>
  );
};

export default Packages;
