import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Page } from '../Page';
import { getAgencies } from '../../api/agencies';
import { useModal } from '../CTVModal';
import { AgencyDeleteModal } from './AgencyDeleteModal';

function Agency({agency}) {
  const [handleClose, handleShow, show] = useModal()
  return (
    <div key={`agency-card${agency.id}`}>
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{agency.name}</Card.Title>
        <Card.Text>
          
        </Card.Text>
      <div style={{display: "flex", gap: 8}}>
        <Button variant="primary">Ver perfil</Button>
        <Button variant="outline-danger" onClick={handleShow}>Dar de baja</Button>
      </div>
      </Card.Body>
    </Card>
    {show && <AgencyDeleteModal agency={agency} handleClose={handleClose} show={show} />}
    </div>
  );
}

function AgencyList({agencies}) {
  return agencies.map(agency => (<Agency agency={agency} />))
}

export function Agencies() {
  const [agencies, setAgencies] = useState([])

  useEffect(() => {
    getAgencies().then((response)=>{
      setAgencies(response.data)
    })
  }, [])
  return (
    <Page>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8}}>
      <AgencyList agencies={agencies} />
      </div>
      </Page>
  )
}
