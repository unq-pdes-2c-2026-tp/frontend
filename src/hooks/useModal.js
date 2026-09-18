import { useState } from "react";

export function useModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return [handleClose, handleShow, show];
}
