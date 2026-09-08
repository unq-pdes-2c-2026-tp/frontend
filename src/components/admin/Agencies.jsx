import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Page } from '../Page';
import { getAgencies } from '../../api/agencies';
import { useModal } from '../CTVModal';
import { AgencyDeleteModal } from './AgencyDeleteModal';
import { getCurrentMonth } from '../../format-utils/dates';
import { asMoney } from '../../format-utils/money';
import FAB from '../fab';
import { AgencyCreateModal } from './AgencyCreateModal';

function Agency({agency}) {
  const [handleClose, handleShow, show] = useModal()
  const currentMonth = getCurrentMonth()
  return (
    <div>
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{agency.name}</Card.Title>
        <Card.Text>
          Recaudación de {currentMonth}: {asMoney(100000)}
        </Card.Text>
      <div style={{display: "flex", gap: 8}}>
        <Button variant="outline-danger" onClick={handleShow}>Dar de baja</Button>
      </div>
      </Card.Body>
    </Card>
    {show && <AgencyDeleteModal agency={agency} handleClose={handleClose} show={show} />}
    </div>
  );
}

function AgencyList({agencies}) {
  return agencies.map(agency => (<Agency agency={agency} key={`agency-card${agency.id}`}/>))
}

export function Agencies() {
  const [agencies, setAgencies] = useState([])
  const [handleClose, handleShow, show] = useModal()

  useEffect(() => {
    getAgencies().then((response)=>{
      setAgencies(response.data)
    })
  }, [])

  return (
    <Page>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8}}>
        <AgencyList agencies={agencies} />
        <FAB onClick={handleShow}/>
      </div>
      {show && <AgencyCreateModal handleClose={handleClose} show={show}/>}
      </Page>
  )
}
