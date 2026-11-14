import { useNavigate } from "react-router";
import "../../styles/packages.css";
import { Page } from "../Page";
import { ROUTES } from "../../routes/constants";
import { IconButton } from "../IconButton";
import { FaRegTrashAlt } from "react-icons/fa";
import { useFavorites } from "../../hooks/useFavorites";
import { Spinner } from "react-bootstrap";
import { PackageRow } from "./PackageRow";

const Favorites = () => {
  const navigate = useNavigate();
  const {
    favoritePackages,
    loading,
    actionLoading,
    error,
    deleteFavoriteById,
  } = useFavorites({ withPackageDetails: true });

  return (
    <Page>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Tu selección</p>
          <h1>Favoritos</h1>
          <p className="heading-copy">
            Paquetes que guardaste para revisar o comprar más adelante.
          </p>
        </div>
        <div className="heading-stat">
          <strong>{favoritePackages.length}</strong>
          <span>paquetes guardados</span>
        </div>
      </section>

      <section className="package-list" aria-live="polite">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center my-5 py-4">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-3 text-muted fw-bold">Cargando tus favoritos...</p>
          </div>
        ) : (
          <>
            <div className="list-header">
              <span>{favoritePackages.length} resultados</span>
              <span>Ordenado por agregados recientemente</span>
            </div>

            {favoritePackages.map((item) => (
              <PackageRow
                key={item.favoriteId}
                item={item}
                actions={
                  <IconButton
                    onClick={() =>
                      !actionLoading && deleteFavoriteById(item.favoriteId)
                    }
                    icon={<FaRegTrashAlt />}
                    aria-label="Quitar de favoritos"
                  />
                }
              />
            ))}

            {favoritePackages.length === 0 && !error && (
              <div className="empty-state">
                <strong>Todavía no tenés paquetes favoritos</strong>
                <span>
                  Explorá el catálogo y guardá los viajes que más te gusten.
                </span>
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={() => navigate(ROUTES.PACKAGES)}
                >
                  Ir al catálogo
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </Page>
  );
};

export default Favorites;
