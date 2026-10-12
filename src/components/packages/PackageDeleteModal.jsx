import CTVModal from "../CTVModal";
import { deletePackage } from "../../api/packages";
import { useMessages } from "../../hooks/useMessages";
import { PERMISSION_DENIED_MESSAGE } from "../../constants";

export function PackageDeleteModal({ packageItem, handleClose, show, onOk }) {
  const { success, error } = useMessages();

  const handleDelete = () => {
    deletePackage(packageItem.id)
      .then(() => {
        if (success) success(`Se eliminó el paquete ${packageItem.name}`);
        onOk();
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          if (error) error(PERMISSION_DENIED_MESSAGE);
        } else {
          if (error) error("Ocurrió un error al eliminar el paquete");
        }
      });
  };

  return (
    <CTVModal
      heading="Eliminar paquete"
      body={`¿Estás seguro de que querés eliminar el paquete "${packageItem?.name}"? Esta acción no se puede deshacer.`}
      okAction={handleDelete}
      okLabel="Eliminar"
      handleClose={handleClose}
      show={show}
    />
  );
}
