import { useEffect } from "react";
import { getAgencies } from "../api/agencies";
import "../styles/Register.css";

export function AgencySelect({
  agencies,
  setAgencies,
  handleInputChange,
  value,
}) {
  useEffect(() => {
    getAgencies().then((response) => {
      setAgencies(response.data);
    });
  }, [setAgencies]);
  return (
    <>
      <label htmlFor="RegisterAgencySelect">Selecciona una agencia</label>
      <select
        id="RegisterAgency"
        name="agency"
        className="registerInput register-select"
        value={value || ""}
        onChange={handleInputChange}
      >
        <option value="">Seleccioná una agencia</option>
        {agencies.map((agency) => (
          <option key={agency.id} value={agency.id}>
            {agency.name}
          </option>
        ))}
      </select>
    </>
  );
}
