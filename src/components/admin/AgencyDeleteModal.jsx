import { deleteAgency } from "../../api/agencies";
import CTVModal from "../CTVModal";
import { useMessages } from "../../hooks/useMessages";
import { PERMISSION_DENIED_MESSAGE } from "../../constants";

export function AgencyDeleteModal({agency, handleClose, show}){
  const {success, error} = useMessages();

  const deleteFunc = () => {
    deleteAgency(agency.id).then(()=>{
      success(`Se borró la agencia ${agency.name}`)
    }).catch(err => {
      if (err.response.status === 403) {
        error(PERMISSION_DENIED_MESSAGE)
      }
      else{
        error("Ocurrió un error al borrar la agencia")
      }
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