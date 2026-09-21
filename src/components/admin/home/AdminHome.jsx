import { useEffect, useState } from "react";
import { getTopSpenderUsers } from "../../../api/adminInsights";
import { Col, Container, Row } from "react-bootstrap";
import { Page } from "../../Page";
import { asMoney } from "../../../format-utils/money";
import "../../../styles/AdminHome.css";

export function AdminHome() {
  const [topSpenders, setTopSpenders] = useState([]);

  useEffect(() => {
    getTopSpenderUsers().then((response) => setTopSpenders(response.data));
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
      </div>
    </Page>
  );
}

function TopSpenders({ spenders }) {
  return (
    <div
      className="shadow"
      style={{
        border: "1px solid gray",
        borderRadius: 5,
        padding: 16,
        display: "flex",
        gap: 4,
        flexDirection: "column",
        minWidth: 400,
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          borderBottom: "1px solid gray",
          paddingBottom: 4,
          gap: 4,
        }}
      >
        Top compradores
      </div>
      <Container>
        {spenders.length === 0 && (
          <div
            style={{
              fontStyle: "italic",
              textAlign: "center",
              color: "gray",
            }}
          >
            Aún no hay compradores
          </div>
        )}
        {spenders.map((spender) => (
          <Spender spender={spender}></Spender>
        ))}
      </Container>
    </div>
  );
}

function Spender({ spender }) {
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
          <div>{spender.user.name}</div>
          <div style={{ fontSize: 14, color: "gray", fontStyle: "italic" }}>
            {spender.user.email}
          </div>
        </div>
      </Col>
      <Col style={{ textAlign: "right", alignContent: "center" }}>
        {asMoney(spender.total_spent)}
      </Col>
    </Row>
  );
}
