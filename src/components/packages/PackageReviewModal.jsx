import { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { createReview, updateReview } from "../../api/packages";

export const PackageReviewModal = ({
  show,
  handleClose,
  purchaseId,
  packageName,
  existingReview = null,
  onOk,
}) => {
  const isEditing = Boolean(existingReview);

  const [score, setScore] = useState(existingReview?.score ?? 10);
  const [hoveredScore, setHoveredScore] = useState(null);
  const [reviewText, setReviewText] = useState(existingReview?.review ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const activeScore = hoveredScore !== null ? hoveredScore : Number(score);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const request = isEditing
      ? updateReview(existingReview.id, {
          score: Number(score),
          review: reviewText,
        })
      : createReview({
          package_purchase: purchaseId,
          score: Number(score),
          review: reviewText,
        });

    request
      .then(() => {
        setSubmitting(false);
        onOk?.();
        handleClose();
      })
      .catch((err) => {
        setSubmitting(false);
        const detail =
          err.response?.data?.package_purchase?.[0] ||
          err.response?.data?.score?.[0] ||
          err.response?.data?.review?.[0] ||
          "No se pudo guardar la reseña.";
        setError(detail);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar reseña" : "Calificar paquete"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {packageName && (
            <p className="text-muted small mb-3">
              Paquete: <strong>{packageName}</strong>
            </p>
          )}

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0 fw-semibold">
                Puntaje ({activeScore}/10)
              </Form.Label>
              {Number(score) > 0 && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 text-muted text-decoration-none"
                  onClick={() => setScore(0)}
                >
                  Poner 0
                </Button>
              )}
            </div>

            <div
              className="d-flex align-items-center justify-content-between border rounded p-2 bg-light"
              onMouseLeave={() => setHoveredScore(null)}
              role="radiogroup"
              aria-label="Puntaje del paquete"
              tabIndex={0}
            >
              {Array.from({ length: 10 }, (_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= activeScore;

                return (
                  <Button
                    key={starValue}
                    type="button"
                    variant="link"
                    className="p-1 border-0 shadow-none"
                    onClick={() => setScore(starValue)}
                    onMouseEnter={() => setHoveredScore(starValue)}
                    aria-label={`${starValue} de 10 estrellas`}
                    aria-checked={Number(score) === starValue}
                    role="radio"
                  >
                    <FaStar
                      size={24}
                      color={isFilled ? "#ffc107" : "#ced4da"}
                    />
                  </Button>
                );
              })}
            </div>
          </Form.Group>

          <Form.Group controlId="reviewComment">
            <Form.Label className="fw-semibold">Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={255}
              required
              placeholder="Contá cómo fue tu experiencia con el viaje..."
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
            />
            <Form.Text className="text-muted">
              {reviewText.length}/255 caracteres
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Publicar reseña"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
