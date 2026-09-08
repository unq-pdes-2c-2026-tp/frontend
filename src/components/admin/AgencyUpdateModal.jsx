import CTVModal from "../CTVModal";
import { useMessages } from "../../hooks/useMessages";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { PERMISSION_DENIED_MESSAGE } from "../../constants";
import { updateAgency } from "../../api/agencies";

export function AgencyUpdateModal({handleClose, show, onOk, agency}){
  const {success, error} = useMessages();
  const [name, setName]= useState(agency.name)

  const createFunc = () => {
    updateAgency({...agency, name}).then(()=>{
      onOk();
      success(`Se modificó la agencia ${name}`)
    }).catch(err => {
      if (err.response.status === 403) {
        error(PERMISSION_DENIED_MESSAGE)
      }
      else{
        error("Ocurrió un error al modificar la agencia")
      }
    })
  }

  return (
    <CTVModal 
    heading="Modificar agencia"
    body={
      <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Nombre</Form.Label>
        <Form.Control placeholder="Mirt mart" value={name} onChange={e => setName(e.target.value)}/>
      </Form.Group>
    </Form>
    }
    okAction={createFunc}
    okLabel="Guardar"
    handleClose={handleClose}
    show={show}
    />
  )
}
