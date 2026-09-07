import { format } from "date-fns";
import { es } from "date-fns/locale";

export function monthName(date) {
  return format(date, "MMMM", {locale: es})
}

export function getCurrentMonth(){
return monthName(new Date())
}