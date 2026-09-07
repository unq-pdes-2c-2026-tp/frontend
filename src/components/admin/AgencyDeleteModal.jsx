import { deleteAgency } from "../../api/agencies";
import CTVModal from "../CTVModal";

export function AgencyDeleteModal({agency, handleClose, show}){
  const deleteFunc = () => {
    deleteAgency(agency.id).then(()=>{

    })
  }
  return (
    <CTVModal 
    heading="Dar de baja agencia"
    body={`Desea dar de baja la agencia ${agency.name}?`}
    okAction={deleteFunc}
    okLabel="Borrar"
    handleClose={handleClose}
    show={show}
    />
  )
}