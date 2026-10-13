import CTVModal from "../CTVModal";
import { purchasePackage } from "../../api/packages";
import { useMessages } from "../../hooks/useMessages";

export function PackagePurchaseModal({ packageItem, handleClose, show, onOk }) {
  const { success, error } = useMessages();

  const handlePurchase = () => {
    purchasePackage(packageItem.id)
      .then(() => {
        if (success)
          success(`¡Compraste el paquete "${packageItem.name}" con éxito!`);
        if (onOk) onOk();
      })
      .catch((err) => {
        const detail =
          err?.response?.data?.package ||
          "Ocurrió un error al procesar la compra.";
        if (error) error(Array.isArray(detail) ? detail[0] : detail);
      });
  };

  return (
    <CTVModal
      heading="Confirmar compra"
      body={`¿Estás seguro de que querés comprar el paquete "${packageItem?.name}" por un precio de $${packageItem?.price}?`}
      okAction={handlePurchase}
      okLabel="Comprar"
      handleClose={handleClose}
      show={show}
    />
  );
}
