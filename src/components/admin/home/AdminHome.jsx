import { useEffect, useState } from 'react';
import { Page } from '../Page';
import { getTopSpenderUsers } from '../../../api/adminInsights';

export function AdminHome() {
  const [topSpenders, setTopSpenders] = useState([])

  useEffect(()=>{
    getTopSpenderUsers().then(response => setTopSpenders(response.data))
  }, [])
  
  return (
    <Page>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8}}>

      </div>
    </Page>
  )
}
