import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../../styles/packages.css";
import { Page } from "../Page";
import { getPackages } from "../../api/packages";
import { ROUTES } from "../../routes/constants";
import { getAgencies } from "../../api/agencies";
import { UNSELECTED, USER_TYPE_MAP } from "../../constants";
import { getStoredUser } from "../../store/local";
import { PackageDeleteModal } from "./PackageDeleteModal";
import { IconButton } from "../IconButton";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { useModal } from "../../hooks/useModal";
import { PackageRow } from "./PackageRow";

const Package = ({ item, reloadPackages }) => {
  const navigate = useNavigate();
  const [handleDeleteClose, handleDeleteShow, showDeleteModal] = useModal();

  const user = getStoredUser();
  const hasDeletePermission = [
    USER_TYPE_MAP.ADMIN,
    USER_TYPE_MAP.AGENCY,
  ].includes(user.user_type.toString());
  const hasUpdatePermission = [
    USER_TYPE_MAP.ADMIN,
    USER_TYPE_MAP.AGENCY,
  ].includes(user.user_type.toString());

  const navigateUpdatePackage = () => {
    navigate(ROUTES.UPDATE_PACKAGE(item.id));
  };

  return (
    <>
      <PackageRow
        item={item}
        actions={
          <>
            {hasUpdatePermission && (
              <IconButton
                onClick={navigateUpdatePackage}
                icon={<FaPencilAlt />}
              />
            )}
            {hasDeletePermission && (
              <IconButton onClick={handleDeleteShow} icon={<FaRegTrashAlt />} />
            )}
          </>
        }
      />
      {showDeleteModal && (
        <PackageDeleteModal
          packageItem={item}
          handleClose={handleDeleteClose}
          show={showDeleteModal}
          onOk={reloadPackages}
        />
      )}
    </>
  );
};

const PackageList = ({ defaultAgency }) => {
  const [search, setSearch] = useState("");
  const [agency, setAgency] = useState(defaultAgency);
  const [agencies, setAgencies] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packagesLoad, setPackagesLoad] = useState(false);
  const [error, setError] = useState("");
  const reloadPackages = () => setPackagesLoad((prev) => !prev);

  useEffect(() => {
    getPackages(agency, search)
      .then(({ data }) => setPackages(data))
      .catch(() => setError("No se pudieron cargar los paquetes."));
  }, [agency, search, packagesLoad]);

  useEffect(() => {
    getAgencies().then(({ data }) => {
      setAgencies(data);
    });
  }, []);

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
        {defaultAgency === UNSELECTED && (
          <label className="select-field">
            <span>Agencia</span>
            <select
              value={agency || UNSELECTED}
              onChange={(event) => setAgency(event.target.value)}
            >
              <option key={UNSELECTED}>Todas las agencias</option>
              {agencies.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </section>
      <section className="package-list" aria-live="polite">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="list-header">
          <span>{packages.length} resultados</span>
          <span>Ordenado por más recientes</span>
        </div>
        {packages.map((item) => (
          <Package key={item.id} item={item} reloadPackages={reloadPackages} />
        ))}
        {packages.length === 0 && (
          <div className="empty-state">
            <strong>No encontramos paquetes</strong>
            <span>Probá con otro destino o agencia.</span>
          </div>
        )}
      </section>
    </Page>
  );
};

const Packages = () => {
  const user = getStoredUser();
  return (
    <PackageList
      defaultAgency={
        user.user_type == USER_TYPE_MAP.AGENCY ? user.agency : UNSELECTED
      }
    />
  );
};

export default Packages;
