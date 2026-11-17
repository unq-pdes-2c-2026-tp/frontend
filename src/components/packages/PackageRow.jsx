import { useNavigate } from "react-router";
import { asMoney } from "../../format-utils/money";
import { formatFlightDate } from "../../format-utils/dates";
import { ROUTES } from "../../routes/constants";
import { GrayStar, Stars } from "../Stars";

export const PackageRow = ({ item, actions }) => {
  const navigate = useNavigate();

  const reviewsCount = item.reviews_count ?? item.reviews?.length ?? 0;
  const avgScore = item.avg_score;

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
        <div className="package-title-line d-flex align-items-center justify-content-between gap-2">
          <h2>{item.name}</h2>
          <div className="d-flex align-items-center gap-1">
            {avgScore !== null && avgScore !== undefined ? (
              <Stars amount={Number(avgScore)} />
            ) : (
              <GrayStar />
            )}
            {reviewsCount > 0 && (
              <small className="text-muted">({reviewsCount})</small>
            )}
          </div>
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
