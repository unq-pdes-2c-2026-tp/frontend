import { createAgency } from "../../api/agencies";
import CTVModal from "../CTVModal";
import { useMessages } from "../../hooks/useMessages";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { PERMISSION_DENIED_MESSAGE } from "../../constants";

export function AgencyCreateModal({ handleClose, show, onOk }) {
  const { success, error } = useMessages();
  const [name, setName] = useState("");

  const createFunc = () => {
    createAgency({ name })
      .then(() => {
        onOk();
        success(`Se creó la agencia ${name}`);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          error(PERMISSION_DENIED_MESSAGE);
        } else {
          error("Ocurrió un error al crear la agencia");
        }
      });
  };

  return (
    <CTVModal
      heading="Crear agencia"
      body={
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              placeholder="Mirt mart"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Form>
      }
      okAction={createFunc}
      okLabel="Crear"
      handleClose={handleClose}
      show={show}
    />
  );
}
