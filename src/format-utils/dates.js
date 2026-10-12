import { format } from "date-fns";
import { es } from "date-fns/locale";

export function monthName(date) {
  return format(date, "MMMM", { locale: es });
}

export function getCurrentMonth() {
  return monthName(new Date());
}

export const formatFlightDate = (value) => {
  if (!value) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
};
