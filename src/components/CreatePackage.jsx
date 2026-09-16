import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
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
    getHotels().then(({ data }) => setHotels(data)).catch(() => setError("No se pudieron cargar los hoteles."));
  }, [navigate, user.user_type]);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
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
      const { data } = await getFlights({ date_from: form.dateFrom, date_to: form.dateTo });
      setFlights(data);
      setForm((current) => ({ ...current, outboundFlight: "", returnFlight: "" }));
    } catch {
      setError("No se pudieron consultar los vuelos disponibles.");
    } finally {
      setLoadingFlights(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const selectedHotel = hotels.find((hotel) => String(hotel.id) === form.hotel);
    const outbound = flights.find((flight) => String(flight.id) === form.outboundFlight);
    const returning = flights.find((flight) => String(flight.id) === form.returnFlight);
    if (!selectedHotel || !outbound || !returning) {
      setError("Seleccioná un hotel y los dos vuelos.");
      return;
    }
    if (outbound.origen !== returning.destino || outbound.destino !== returning.origen) {
      setError("El vuelo de vuelta debe regresar desde el destino de ida al origen de ida.");
      return;
    }
    const normalizedPrice = form.price.replace(",", ".");
    if (!/^\d+\.\d{2}$/.test(normalizedPrice)) {
      setError("El precio debe tener exactamente dos decimales, por ejemplo 12323,12.");
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
      const backendError = responseData?.detail || Object.values(responseData || {})
        .flatMap((messages) => Array.isArray(messages) ? messages : [messages])
        .find(Boolean);
      setError(backendError || "No se pudo crear el paquete.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHotel = hotels.find((hotel) => String(hotel.id) === form.hotel);
  return (
    <Page>
      <main className="create-package-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Gestión de agencia</p>
            <h1>Crear paquete</h1>
            <p className="heading-copy">Armá una nueva propuesta para el catálogo.</p>
          </div>
        </div>
        <form className="create-package-form" onSubmit={submit}>
          <section className="row g-4">
            <div className="col-lg-8">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="name">Nombre</label>
                  <input className="form-control" id="name" name="name" value={form.name} onChange={update} required />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="description">Descripción</label>
                  <textarea className="form-control" id="description" name="description" rows="4" value={form.description} onChange={update} />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="hotel">Hotel</label>
                  <select className="form-select" id="hotel" name="hotel" value={form.hotel} onChange={update} required>
                    <option value="">Seleccioná un hotel</option>{hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
                  </select></div>
                <div className="col-md-6"><label className="form-label" htmlFor="price">Precio</label><div className="input-group"><span className="input-group-text">$</span><input className="form-control" id="price" name="price" inputMode="decimal" placeholder="0,00" pattern="[0-9]+,[0-9]{2}" value={form.price} onChange={update} required /></div></div>
              </div>
              <div className="flight-picker mt-4">
                <div className="section-label">Vuelos disponibles</div>
                <div className="row g-3 align-items-end">
                  <div className="col-md-5">
                    <label className="form-label" htmlFor="dateFrom">Desde</label>
                    <input className="form-control" type="date" id="dateFrom" name="dateFrom" value={form.dateFrom} onChange={update} required />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label" htmlFor="dateTo">Hasta</label>
                    <input className="form-control" type="date" id="dateTo" name="dateTo" value={form.dateTo} onChange={update} required />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-outline-dark w-100" type="button" onClick={searchFlights} disabled={loadingFlights}>{loadingFlights ? "..." : "Buscar"}</button>
                  </div>
                </div>
                {flights.length > 0 && 
                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="outboundFlight">Vuelo de ida</label>
                    <select className="form-select" id="outboundFlight" name="outboundFlight" value={form.outboundFlight} onChange={update} required>
                      <option value="">Seleccioná el vuelo</option>
                      {flights.map((flight) => <option key={flight.id} value={flight.id}>{formatFlight(flight)}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="returnFlight">Vuelo de vuelta</label>
                    <select className="form-select" id="returnFlight" name="returnFlight" value={form.returnFlight} onChange={update} required>
                      <option value="">Seleccioná el vuelo</option>
                      {flights.map((flight) => <option key={flight.id} value={flight.id}>{formatFlight(flight)}</option>)}
                    </select>
                  </div>
                </div>}
              </div>
              {error && <div className="alert alert-danger mt-4" role="alert">{typeof error === "string" ? error : "Revisá los datos ingresados."}</div>}
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary create-submit" type="submit" disabled={submitting}>{submitting ? "Creando..." : "Crear paquete"}</button>
                <button className="btn btn-link text-dark" type="button" onClick={() => navigate("/packages")}>Cancelar</button>
              </div>
            </div>
            <div className="col-lg-4">
              <aside className="hotel-preview">
                {selectedHotel?.photo ? 
                <img src={selectedHotel.photo} alt={selectedHotel.name} /> : 
                <div className="hotel-placeholder">{selectedHotel?.name || "Elegí un hotel"}</div>
                }
                <div className="p-3">
                  <span className="section-label">Vista previa</span>
                  <h2>{selectedHotel?.name || "Tu hotel aparecerá acá"}</h2>
                  <p>{selectedHotel?.description || "La foto y los datos del hotel seleccionado se mostrarán en el paquete."}</p>
                </div>
              </aside>
            </div>
          </section>
        </form>
      </main>
    </Page>
  );
}
