import { createPackage } from "../../api/packages";
import "../../styles/create-package.css";
import PackageForm from "./PackageForm";

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

export default function CreatePackage() {
  return (
    <PackageForm
      onSave={createPackage}
      initialForm={initialForm}
      title="Crear paquete"
      description="Armá una nueva propuesta para el catálogo."
      actionLabel="Crear paquete"
      progressLabel="Creando..."
      successMessage="Paquete creado correctamente"
      errorMessage="No se pudo crear el paquete."
    />
  );
}
