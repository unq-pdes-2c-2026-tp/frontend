import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { Page } from "./Page";
import { createPackage, getFlights, getHotels } from "../api/packages";
import { getStoredUser } from "../store/local";
import { USER_TYPE_MAP } from "../constants";
import "../styles/create-package.css";

const initialForm = {
  name: "",
  description: "",
  price: "",
  hotel: "",
  dateFrom: "",
  dateTo: "",
  outboundFlight: "",
  returnFlight: "",
};

const formatFlight = (flight) =>
  `${flight.aerolinea} | ${flight.origen} - ${flight.destino} | ${flight.fecha} ${flight.hora}`;

export default function CreatePackage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(initialForm);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const user = getStoredUser() || {};

  useEffect(() => {
    if (String(user.user_type) !== USER_TYPE_MAP.AGENCY) {
      navigate("/packages", { replace: true });
      return;
    }
    getHotels()
      .then(({ data }) => setHotels(data))
      .catch(() => setError("No se pudieron cargar los hoteles."));
  }, [navigate, user.user_type]);

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const searchFlights = async (event) => {
    event.preventDefault();
    if (!form.dateFrom || !form.dateTo) {
      setError("Seleccioná las dos fechas del rango.");
      return;
    }
    setLoadingFlights(true);
    setError("");
    try {
      const { data } = await getFlights({
        date_from: form.dateFrom,
        date_to: form.dateTo,
      });
      setFlights(data);
      setForm((current) => ({
        ...current,
        outboundFlight: "",
        returnFlight: "",
      }));
    } catch {
      setError("No se pudieron consultar los vuelos disponibles.");
    } finally {
      setLoadingFlights(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const selectedHotel = hotels.find(
      (hotel) => String(hotel.id) === form.hotel,
    );
    const outbound = flights.find(
      (flight) => String(flight.id) === form.outboundFlight,
    );
    const returning = flights.find(
      (flight) => String(flight.id) === form.returnFlight,
    );
    if (!selectedHotel || !outbound || !returning) {
      setError("Seleccioná un hotel y los dos vuelos.");
      return;
    }
    if (
      outbound.origen !== returning.destino ||
      outbound.destino !== returning.origen
    ) {
      setError(
        "El vuelo de vuelta debe regresar desde el destino de ida al origen de ida.",
      );
      return;
    }
    const normalizedPrice = form.price.replace(",", ".");
    if (!/^\d+\.\d{2}$/.test(normalizedPrice)) {
      setError(
        "El precio debe tener exactamente dos decimales, por ejemplo 12323,12.",
      );
      return;
    }
    setSubmitting(true);
    try {
      await createPackage({
        name: form.name,
        description: form.description,
        price: normalizedPrice,
        hotel: selectedHotel.id,
        origin: selectedHotel.city,
        outbound_flight_id: outbound.id,
        outbound_flight_date: `${outbound.fecha}T${outbound.hora}Z`,
        return_flight_id: returning.id,
        return_flight_date: `${returning.fecha}T${returning.hora}Z`,
      });
      enqueueSnackbar("Paquete creado correctamente", { variant: "success" });
      navigate("/packages");
    } catch (requestError) {
      const responseData = requestError.response?.data;
      const backendError =
        responseData?.detail ||
        Object.values(responseData || {})
          .flatMap((messages) =>
            Array.isArray(messages) ? messages : [messages],
          )
          .find(Boolean);
      setError(backendError || "No se pudo crear el paquete.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHotel = hotels.find((hotel) => String(hotel.id) === form.hotel);
  return (
    <Page>
      <Container as="main" fluid className="create-package-page px-0">
        <Row className="page-heading align-items-end">
          <Col>
            <p className="eyebrow">Gestión de agencia</p>
            <h1>Crear paquete</h1>
            <p className="heading-copy">
              Armá una nueva propuesta para el catálogo.
            </p>
          </Col>
        </Row>
        <Form className="create-package-form" onSubmit={submit}>
          <Row className="g-4">
            <Col lg={8}>
              <Row className="g-3">
                <Col xs={12}>
                  <Form.Group controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      name="name"
                      value={form.name}
                      onChange={update}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId="description">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      rows={4}
                      value={form.description}
                      onChange={update}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="hotel">
                    <Form.Label>Hotel</Form.Label>
                    <Form.Select
                      name="hotel"
                      value={form.hotel}
                      onChange={update}
                      required
                    >
                      <option value="">Seleccioná un hotel</option>
                      {hotels.map((hotel) => (
                        <option key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="price">
                    <Form.Label>Precio</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        name="price"
                        inputMode="decimal"
                        placeholder="0,00"
                        pattern="[0-9]+,[0-9]{2}"
                        value={form.price}
                        onChange={update}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Card className="flight-picker mt-4">
                <Card.Body>
                  <Card.Title as="div" className="section-label">
                    Vuelos disponibles
                  </Card.Title>
                  <Row className="g-3 align-items-end">
                    <Col md={5}>
                      <Form.Group controlId="dateFrom">
                        <Form.Label>Desde</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateFrom"
                          value={form.dateFrom}
                          onChange={update}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group controlId="dateTo">
                        <Form.Label>Hasta</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateTo"
                          value={form.dateTo}
                          onChange={update}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="outline-dark"
                        className="w-100"
                        type="button"
                        onClick={searchFlights}
                        disabled={loadingFlights}
                      >
                        {loadingFlights ? (
                          <Spinner
                            animation="border"
                            size="sm"
                            aria-label="Buscando vuelos"
                          />
                        ) : (
                          "Buscar"
                        )}
                      </Button>
                    </Col>
                  </Row>
                  {flights.length > 0 && (
                    <Row className="g-3 mt-1">
                      <Col md={6}>
                        <Form.Group controlId="outboundFlight">
                          <Form.Label>Vuelo de ida</Form.Label>
                          <Form.Select
                            name="outboundFlight"
                            value={form.outboundFlight}
                            onChange={update}
                            required
                          >
                            <option value="">Seleccioná el vuelo</option>
                            {flights.map((flight) => (
                              <option key={flight.id} value={flight.id}>
                                {formatFlight(flight)}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="returnFlight">
                          <Form.Label>Vuelo de vuelta</Form.Label>
                          <Form.Select
                            name="returnFlight"
                            value={form.returnFlight}
                            onChange={update}
                            required
                          >
                            <option value="">Seleccioná el vuelo</option>
                            {flights.map((flight) => (
                              <option key={flight.id} value={flight.id}>
                                {formatFlight(flight)}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
              {error && (
                <Alert variant="danger" className="mt-4" role="alert">
                  {typeof error === "string"
                    ? error
                    : "Revisá los datos ingresados."}
                </Alert>
              )}
              <div className="d-flex gap-2 mt-4">
                <Button
                  variant="primary"
                  className="create-submit"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                        aria-hidden="true"
                      />
                      Creando...
                    </>
                  ) : (
                    "Crear paquete"
                  )}
                </Button>
                <Button
                  variant="link"
                  className="text-dark"
                  type="button"
                  onClick={() => navigate("/packages")}
                >
                  Cancelar
                </Button>
              </div>
            </Col>
            <Col lg={4}>
              <Card className="hotel-preview">
                {selectedHotel?.photo ? (
                  <Card.Img
                    variant="top"
                    src={selectedHotel.photo}
                    alt={selectedHotel.name}
                  />
                ) : (
                  <div className="hotel-placeholder">
                    {selectedHotel?.name || "Elegí un hotel"}
                  </div>
                )}
                <Card.Body>
                  <Card.Text as="div" className="section-label">
                    Vista previa
                  </Card.Text>
                  <Card.Title>
                    {selectedHotel?.name || "Tu hotel aparecerá acá"}
                  </Card.Title>
                  <Card.Text>
                    {selectedHotel?.description ||
                      "La foto y los datos del hotel seleccionado se mostrarán en el paquete."}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </Page>
  );
}
