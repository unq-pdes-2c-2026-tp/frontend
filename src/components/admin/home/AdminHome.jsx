import { useEffect, useState } from "react";
import {
  getTopCitiesByPurchases,
  getTopCitiesByReviews,
  getTopSpenderUsers,
} from "../../../api/adminInsights";
import { Col, Row } from "react-bootstrap";
import { Page } from "../../Page";
import { asMoney } from "../../../format-utils/money";
import "../../../styles/AdminHome.css";
import { AdminTable } from "./AdminTable";
import { Stars } from "../../Stars";

export function AdminHome() {
  const [topSpenders, setTopSpenders] = useState([]);
  const [topCitiesByPurchases, setTopCitiesByPurchases] = useState([]);
  const [topCitiesByReviews, setTopCitiesByReviews] = useState([]);

  useEffect(() => {
    getTopSpenderUsers().then((response) => setTopSpenders(response.data));
  }, []);

  useEffect(() => {
    getTopCitiesByPurchases().then((response) =>
      setTopCitiesByPurchases(response.data),
    );
  }, []);

  useEffect(() => {
    getTopCitiesByReviews().then((response) =>
      setTopCitiesByReviews(response.data),
    );
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
        <TopCitiesByPurchases cities={topCitiesByPurchases} />
        <TopCitiesByReviews cities={topCitiesByReviews} />
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

function TopCitiesByPurchases({ cities }) {
  return (
    <AdminTable
      items={cities}
      label="Top destinos (paquetes vendidos)"
      emptyLabel="Aún no hay destinos"
      Child={CityPurchase}
    />
  );
}

function TopCitiesByReviews({ cities }) {
  return (
    <AdminTable
      items={cities}
      label="Top destinos (por puntaje)"
      emptyLabel="Aún no hay destinos puntuados"
      Child={CityReview}
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

function CityPurchase({ item }) {
  return (
    <Row>
      <Col>{item.city.name}</Col>
      <Col style={{ textAlign: "right", alignContent: "center" }}>
        {item.total_purchases}
      </Col>
    </Row>
  );
}

function CityReview({ item }) {
  return (
    <Row>
      <Col>{item.city.name}</Col>
      <Col style={{ textAlign: "right", alignContent: "center" }}>
        <Stars amount={item.avg_reviews} />
      </Col>
    </Row>
  );
}
