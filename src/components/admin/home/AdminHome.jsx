import { useEffect, useState } from "react";
import { getTopCities, getTopSpenderUsers } from "../../../api/adminInsights";
import { Col, Row } from "react-bootstrap";
import { Page } from "../../Page";
import { asMoney } from "../../../format-utils/money";
import "../../../styles/AdminHome.css";
import { AdminTable } from "./AdminTable";

export function AdminHome() {
  const [topSpenders, setTopSpenders] = useState([]);
  const [topCities, setTopCities] = useState([]);

  useEffect(() => {
    getTopSpenderUsers().then((response) => setTopSpenders(response.data));
  }, []);

  useEffect(() => {
    getTopCities().then((response) => setTopCities(response.data));
  }, []);

  return (
    <Page>
      <div
        style={{
          display: "grid",
          margin: 8,
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
        }}
      >
        <TopSpenders spenders={topSpenders} />
        <TopCities cities={topCities} />
      </div>
    </Page>
  );
}

function TopSpenders({ spenders }) {
  return (
    <AdminTable
      items={spenders}
      label="Top compradores"
      emptyLabel="Aún no hay compradores"
      Child={Spender}
    />
  );
}

function TopCities({ cities }) {
  return (
    <AdminTable
      items={cities}
      label="Top destinos (paquetes vendidos)"
      emptyLabel="Aún no hay destinos"
      Child={City}
    />
  );
}

function Spender({ item }) {
  return (
    <Row>
      <Col>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <div>{item.user.name}</div>
          <div style={{ fontSize: 14, color: "gray", fontStyle: "italic" }}>
            {item.user.email}
          </div>
        </div>
      </Col>
      <Col style={{ textAlign: "right", alignContent: "center" }}>
        {asMoney(item.total_spent)}
      </Col>
    </Row>
  );
}

function City({ item }) {
  return (
    <Row>
      <Col>{item.city.name}</Col>
      <Col style={{ textAlign: "right", alignContent: "center" }}>
        {item.total_purchases}
      </Col>
    </Row>
  );
}
