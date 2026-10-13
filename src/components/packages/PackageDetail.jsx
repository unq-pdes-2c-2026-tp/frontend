import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Page } from "../Page";
import { asMoney } from "../../format-utils/money";
import { formatFlightDate } from "../../format-utils/dates";
import { getPackageById } from "../../api/packages";
import { USER_TYPE_MAP } from "../../constants";
import { ROUTES } from "../../routes/constants";
import { getStoredUser } from "../../store/local";
import { useModal } from "../../hooks/useModal";
import { PackageDeleteModal } from "./PackageDeleteModal";
import { PackagePurchaseModal } from "./PackagePurchaseModal";

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [packageDetail, setPackageDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [handleDeleteClose, handleDeleteShow, showDeleteModal] = useModal();
  const [handlePurchaseClose, handlePurchaseShow, showPurchaseModal] =
    useModal();

  const user = getStoredUser();
  const currentUserType = user?.user_type?.toString();

  const isEndUser = currentUserType === USER_TYPE_MAP.END_USER;
  const isAgency = currentUserType === USER_TYPE_MAP.AGENCY;

  const isPackageOwnerAgency =
    isAgency && user?.agency === packageDetail?.agency;

  useEffect(() => {
    getPackageById(id)
      .then(({ data }) => {
        setPackageDetail(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la información del paquete.");
        setLoading(false);
      });
  }, [id]);

  const handleFavorite = () => {
    alert("Función de favoritos en desarrollo");
  };

  const onConfirmPurchase = () => {
    navigate(ROUTES.PACKAGES); // Eventualmente reemplazar por ir a Mis compras o algo asi
  };

  const onConfirmDelete = () => {
    navigate(ROUTES.PACKAGES);
  };

  if (loading) {
    return (
      <Page>
        <Container className="text-center my-5 py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-3 text-muted fw-bold">
            Cargando detalle del paquete...
          </p>
        </Container>
      </Page>
    );
  }

  if (error || !packageDetail) {
    return (
      <Page>
        <Container className="my-4">
          <Alert variant="danger">{error || "Paquete no encontrado."}</Alert>
          <Link to={ROUTES.PACKAGES} className="btn btn-outline-secondary">
            ← Volver al catálogo
          </Link>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container className="py-4">
        <div className="mb-4">
          <Link
            to={ROUTES.PACKAGES}
            className="text-decoration-none text-muted small"
          >
            ← Volver al catálogo
          </Link>
          <p className="text-uppercase text-muted fw-bold small mt-2 mb-1">
            Detalle del viaje
          </p>
          <h1 className="fw-bold mb-2">{packageDetail.name}</h1>
          <div className="d-flex align-items-center gap-2">
            <Badge
              bg="secondary"
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{ width: "24px", height: "24px" }}
            >
              {packageDetail.agency_name?.charAt(0)}
            </Badge>
            <span className="text-secondary fw-semibold">
              {packageDetail.agency_name}
            </span>
          </div>
        </div>

        <Card className="shadow-sm border-0 rounded-3">
          {packageDetail.hotel_photo ? (
            <Card.Img
              variant="top"
              src={packageDetail.hotel_photo}
              alt={packageDetail.hotel_name}
              style={{ height: "300px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-light text-secondary d-flex align-items-center justify-content-center"
              style={{ height: "200px" }}
            >
              <h4 className="m-0 fw-normal">{packageDetail.hotel_name}</h4>
            </div>
          )}

          <Card.Body className="p-4">
            <Row className="g-4">
              <Col lg={8}>
                <h4 className="fw-bold mb-3">Descripción del paquete</h4>
                <p
                  className="text-secondary fs-5 mb-4"
                  style={{ lineHeight: "1.6" }}
                >
                  {packageDetail.description}
                </p>

                <h5 className="fw-bold mb-3">Detalles del itinerario</h5>
                <ul className="list-group list-group-flush border-top border-bottom mb-3">
                  <li className="list-group-item bg-transparent px-0 py-2">
                    <strong>Hotel:</strong> {packageDetail.hotel_name}
                  </li>
                  <li className="list-group-item bg-transparent px-0 py-2">
                    <strong>Fecha de ida:</strong>{" "}
                    {formatFlightDate(packageDetail.outbound_flight_date)}
                  </li>
                  <li className="list-group-item bg-transparent px-0 py-2">
                    <strong>Fecha de vuelta:</strong>{" "}
                    {formatFlightDate(packageDetail.return_flight_date)}
                  </li>
                </ul>
              </Col>

              <Col lg={4}>
                <Card className="bg-light border-0 p-3 h-100 justify-content-between">
                  <div>
                    <span className="text-muted d-block small mb-1">
                      Precio final
                    </span>
                    <h2 className="fw-bold text-dark mb-3">
                      {asMoney(packageDetail.price)}
                    </h2>
                  </div>

                  <div className="d-grid gap-2">
                    {isEndUser && (
                      <>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handlePurchaseShow}
                        >
                          Comprar paquete
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={handleFavorite}
                        >
                          ♥ Agregar a favoritos
                        </Button>
                      </>
                    )}

                    {isPackageOwnerAgency && (
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={handleDeleteShow}
                      >
                        Borrar paquete
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      {showDeleteModal && (
        <PackageDeleteModal
          packageItem={packageDetail}
          handleClose={handleDeleteClose}
          show={showDeleteModal}
          onOk={onConfirmDelete}
        />
      )}

      {showPurchaseModal && (
        <PackagePurchaseModal
          packageItem={packageDetail}
          handleClose={handlePurchaseClose}
          show={showPurchaseModal}
          onOk={onConfirmPurchase}
        />
      )}
    </Page>
  );
};

export default PackageDetail;
