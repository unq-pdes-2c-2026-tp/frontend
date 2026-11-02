import { useParams } from "react-router";
import { getPackageById, updatePackage } from "../../api/packages";
import "../../styles/create-package.css";
import PackageForm from "./PackageForm";
import { useEffect, useState } from "react";

export default function UpdatePackage() {
  const { id } = useParams();
  const [packageDetail, setPackageDetail] = useState(null);
  useEffect(() => {
    getPackageById(id).then(({ data }) => {
      setPackageDetail(data);
    });
  }, [id]);

  return (
    <>
      {packageDetail && (
        <PackageForm
          onSave={updatePackage}
          initialForm={{
            name: packageDetail.name,
            description: packageDetail.description,
            price: packageDetail.price.replace(".", ","),
            hotel: packageDetail.hotel,
            dateFrom: packageDetail.dateFrom,
            dateTo: packageDetail.dateTo,
            outboundFlight: packageDetail.outbound_flight_id,
            returnFlight: packageDetail.return_flight_id,
            agency: packageDetail.agency,
            id: packageDetail.id,
          }}
          title="Modificar paquete"
          description=""
          actionLabel="Modificar paquete"
          progressLabel="Modificando..."
          successMessage="Paquete modificado correctamente"
          errorMessage="No se pudo modificar el paquete."
          updating
        />
      )}
    </>
  );
}
