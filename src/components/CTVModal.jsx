import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CTVModal({ heading, body, okLabel, okAction, handleClose, show }) {
  const onAccept = () => {
    okAction();
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onAccept}>
            {okLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CTVModal;
