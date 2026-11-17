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
  ListGroup,
} from "react-bootstrap";
import { Page } from "../Page";
import { asMoney } from "../../format-utils/money";
import { formatFlightDate } from "../../format-utils/dates";
import { getPackageById, getPurchases, getReviews } from "../../api/packages";
import { USER_TYPE_MAP } from "../../constants";
import { ROUTES } from "../../routes/constants";
import { getStoredUser } from "../../store/local";
import { useModal } from "../../hooks/useModal";
import { useFavorites } from "../../hooks/useFavorites";
import { PackageDeleteModal } from "./PackageDeleteModal";
import { PackagePurchaseModal } from "./PackagePurchaseModal";
import { PackageReviewModal } from "./PackageReviewModal";
import { GrayStar, Stars } from "../Stars";

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [packageDetail, setPackageDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userPurchase, setUserPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadFlag, setReloadFlag] = useState(false);

  const [handleDeleteClose, handleDeleteShow, showDeleteModal] = useModal();
  const [handlePurchaseClose, handlePurchaseShow, showPurchaseModal] =
    useModal();
  const [handleReviewClose, handleReviewShow, showReviewModal] = useModal();

  const { getFavoriteByPackageId, toggleFavorite, actionLoading } =
    useFavorites();

  const user = getStoredUser();
  const currentUserType = user?.user_type?.toString();

  const isEndUser = currentUserType === USER_TYPE_MAP.END_USER;
  const isAgency = currentUserType === USER_TYPE_MAP.AGENCY;
  const isAdmin = currentUserType === USER_TYPE_MAP.ADMIN;

  const isPackageOwnerAgency =
    isAdmin || (isAgency && user?.agency === packageDetail?.agency);

  const isFavorite = Boolean(getFavoriteByPackageId(id));

  const reloadDetail = () => setReloadFlag((prev) => !prev);

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

    getReviews({ package: id })
      .then(({ data }) => setReviews(data))
      .catch(() => setReviews([]));

    if (isEndUser) {
      getPurchases()
        .then(({ data }) => {
          const matchingPurchase = data.find(
            (purchase) => Number(purchase.package) === Number(id),
          );
          setUserPurchase(matchingPurchase || null);
        })
        .catch(() => setUserPurchase(null));
    }
  }, [id, isEndUser, reloadFlag]);

  const onConfirmPurchase = () => {
    navigate(ROUTES.PURCHASES);
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

  const calculatedAvgScore =
    packageDetail.avg_score !== null && packageDetail.avg_score !== undefined
      ? Number(packageDetail.avg_score)
      : reviews.length > 0
        ? Number(
            (
              reviews.reduce((acc, item) => acc + Number(item.score), 0) /
              reviews.length
            ).toFixed(1),
          )
        : null;

  const userExistingReview = userPurchase?.reviews?.[0] || null;

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
          <div className="d-flex align-items-center flex-wrap gap-3">
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

            <div className="d-flex align-items-center gap-2">
              {calculatedAvgScore ? (
                <>
                  <Stars amount={calculatedAvgScore} />
                  <small className="text-muted">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "reseña" : "reseñas"})
                  </small>
                </>
              ) : (
                <>
                  <GrayStar />
                  <small className="text-muted">Sin reseñas aún</small>
                </>
              )}
            </div>
          </div>
        </div>

        <Card className="shadow-sm border-0 rounded-3 mb-4">
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
                          variant={isFavorite ? "danger" : "outline-secondary"}
                          onClick={() => toggleFavorite(id)}
                          disabled={actionLoading}
                        >
                          {actionLoading
                            ? "Actualizando..."
                            : isFavorite
                              ? "♥ Quitar de favoritos"
                              : "♥ Agregar a favoritos"}
                        </Button>
                        {userPurchase && (
                          <Button
                            variant="outline-primary"
                            onClick={handleReviewShow}
                          >
                            {userExistingReview
                              ? "Editar mi reseña"
                              : "Calificar mi compra"}
                          </Button>
                        )}
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

        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                Reseñas del paquete ({reviews.length})
              </h4>
              {calculatedAvgScore && <Stars amount={calculatedAvgScore} />}
            </div>

            {reviews.length === 0 ? (
              <p className="text-muted mb-0">
                Todavía no hay reseñas disponibles para este paquete.
              </p>
            ) : (
              <ListGroup variant="flush">
                {reviews.map((item) => (
                  <ListGroup.Item key={item.id} className="px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>
                        {item.user_detail?.name ||
                          item.user_detail?.email ||
                          "Usuario"}
                      </strong>
                      <div className="d-flex align-items-center gap-2">
                        <Stars amount={item.score} />
                        <small className="text-muted">
                          {formatFlightDate(item.datetime)}
                        </small>
                      </div>
                    </div>
                    <p className="text-secondary mb-0">{item.review}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
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

      {showReviewModal && userPurchase && (
        <PackageReviewModal
          show={showReviewModal}
          handleClose={handleReviewClose}
          purchaseId={userPurchase.id}
          packageName={packageDetail.name}
          existingReview={userExistingReview}
          onOk={reloadDetail}
        />
      )}
    </Page>
  );
};

export default PackageDetail;
