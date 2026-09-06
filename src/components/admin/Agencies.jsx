import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getAgencies } from '../../api/ApiRequests';

function Agency({agency}) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{agency.name}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Ver perfil</Button>
      </Card.Body>
    </Card>
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
    <AgencyList agencies={agencies} />
  )
}
