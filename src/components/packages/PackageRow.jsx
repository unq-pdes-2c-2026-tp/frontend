import { useNavigate } from "react-router";
import { asMoney } from "../../format-utils/money";
import { formatFlightDate } from "../../format-utils/dates";
import { ROUTES } from "../../routes/constants";

export const PackageRow = ({ item, actions }) => {
  const navigate = useNavigate();

  return (
    <article className="package-row">
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
        <button
          type="button"
          onClick={() => navigate(ROUTES.PACKAGES_DETAIL(item.id))}
        >
          Ver paquete
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {actions}
    </article>
  );
};
