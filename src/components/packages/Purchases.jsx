import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Alert, Badge, Button, Spinner } from "react-bootstrap";
import "../../styles/packages.css";
import { Page } from "../Page";
import { PackageRow } from "./PackageRow";
import { getPackages, getPurchases } from "../../api/packages";
import { getStoredUser } from "../../store/local";
import { UNSELECTED, USER_TYPE_MAP } from "../../constants";
import { ROUTES } from "../../routes/constants";
import { asMoney } from "../../format-utils/money";
import { formatFlightDate } from "../../format-utils/dates";

const ROLE_UI_CONFIG = {
  [USER_TYPE_MAP.END_USER]: {
    eyebrow: "Tu historial",
    title: "Mis compras",
    description: "Paquetes turísticos que adquiriste en la plataforma.",
    statLabel: "compras realizadas",
    loadingText: "Cargando tus compras...",
    emptyTitle: "Todavía no realizaste ninguna compra",
    emptyDescription: "Explorá nuestro catálogo y reservá tu próximo viaje.",
    showCatalogButton: true,
  },
  [USER_TYPE_MAP.AGENCY]: {
    eyebrow: "Gestión comercial",
    title: "Mis ventas",
    description: "Historial de paquetes vendidos por tu agencia.",
    statLabel: "ventas registradas",
    loadingText: "Cargando las ventas de tu agencia...",
    emptyTitle: "Aún no registrás ventas",
    emptyDescription:
      "Cuando los usuarios compren tus paquetes aparecerán acá.",
    showCatalogButton: false,
  },
  [USER_TYPE_MAP.ADMIN]: {
    eyebrow: "Panel global",
    title: "Ventas totales",
    description:
      "Registro completo de todas las operaciones realizadas en el sistema.",
    statLabel: "operaciones totales",
    loadingText: "Cargando historial general de ventas...",
    emptyTitle: "No hay ventas registradas",
    emptyDescription: "Todavía no se efectuaron compras en la plataforma.",
    showCatalogButton: false,
  },
};

const Purchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getStoredUser();
  const userType = user?.user_type?.toString() || USER_TYPE_MAP.END_USER;
  const isEndUser = userType === USER_TYPE_MAP.END_USER;
  const uiConfig =
    ROLE_UI_CONFIG[userType] || ROLE_UI_CONFIG[USER_TYPE_MAP.END_USER];

  useEffect(() => {
    let isMounted = true;

    const fetchPurchasesData = async () => {
      try {
        const { data: purchasesData } = await getPurchases();

        // Esto es por si decidimos mandar desde el backend el detalle del paquete o hay que resolverlo a ca
        const needsPackageHydration =
          purchasesData.length > 0 && !purchasesData[0].package_detail;

        let packagesById = {};
        if (needsPackageHydration) {
          const { data: packagesData } = await getPackages(UNSELECTED, "");
          packagesById = packagesData.reduce((acc, pkg) => {
            acc[pkg.id] = pkg;
            return acc;
          }, {});
        }

        const hydratedPurchases = purchasesData
          .map((purchase) => {
            const pkg =
              purchase.package_detail || packagesById[purchase.package];
            if (!pkg) return null;

            return {
              ...pkg,
              // Sobrescribimos el precio con el valor histórico guardado en PackagePurchase
              price: purchase.price,
              purchaseId: purchase.id,
              purchaseDatetime: purchase.datetime,
              buyerId: purchase.user,
              buyerDetail: purchase.user_detail || null,
            };
          })
          .filter(Boolean);

        if (isMounted) {
          setPurchases(hydratedPurchases);
        }
      } catch {
        if (isMounted) {
          setError("No se pudo cargar el listado de operaciones.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPurchasesData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Page>
      <section className="page-heading">
        <div>
          <p className="eyebrow">{uiConfig.eyebrow}</p>
          <h1>{uiConfig.title}</h1>
          <p className="heading-copy">{uiConfig.description}</p>
        </div>
        <div className="heading-stat">
          <strong>{purchases.length}</strong>
          <span>{uiConfig.statLabel}</span>
        </div>
      </section>

      <section className="package-list" aria-live="polite">
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center my-5 py-4">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-3 text-muted fw-bold">{uiConfig.loadingText}</p>
          </div>
        ) : (
          <>
            <div className="list-header">
              <span>{purchases.length} resultados</span>
              <span>Ordenado por operaciones recientes</span>
            </div>

            {purchases.map((item) => (
              <PackageRow
                key={item.purchaseId}
                item={item}
                actions={
                  <div className="d-flex flex-column align-items-end justify-content-center gap-1 ps-2 border-start">
                    <Badge bg="success">Operación #{item.purchaseId}</Badge>
                    <small className="text-muted text-nowrap">
                      {formatFlightDate(item.purchaseDatetime)}
                    </small>
                    {!isEndUser && (
                      <Badge bg="light" text="dark" className="border">
                        Cliente:{" "}
                        {item.buyerDetail?.name ||
                          item.buyerDetail?.email ||
                          `Usuario #${item.buyerId}`}
                      </Badge>
                    )}
                    <small className="fw-semibold text-dark">
                      Abonado: {asMoney(item.price)}
                    </small>
                  </div>
                }
              />
            ))}

            {purchases.length === 0 && !error && (
              <div className="empty-state">
                <strong>{uiConfig.emptyTitle}</strong>
                <span>{uiConfig.emptyDescription}</span>
                {uiConfig.showCatalogButton && (
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => navigate(ROUTES.PACKAGES)}
                  >
                    Ir al catálogo
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </Page>
  );
};

export default Purchases;
