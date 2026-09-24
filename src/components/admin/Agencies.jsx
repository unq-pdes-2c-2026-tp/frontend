import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Page } from "../Page";
import { getDetailedAgencies } from "../../api/agencies";
import { useModal } from "../../hooks/useModal";
import { AgencyDeleteModal } from "./AgencyDeleteModal";
import { getCurrentMonth } from "../../format-utils/dates";
import { asMoney } from "../../format-utils/money";
import FAB from "../fab";
import { AgencyCreateModal } from "./AgencyCreateModal";
import { MdEdit } from "react-icons/md";
import { IconButton } from "../IconButton";
import { AgencyUpdateModal } from "./AgencyUpdateModal";

function Agency({ agency, reloadAgencies }) {
  const [handleDeleteClose, handleDeleteShow, showDeleteModal] = useModal();
  const [handleUpdateClose, handleUpdateShow, showUpdateModal] = useModal();
  const currentMonth = getCurrentMonth();
  return (
    <div>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{agency.name}</div>
              <IconButton
                onClick={handleUpdateShow}
                icon={<MdEdit size={20} color="gray" />}
              />
            </div>
          </Card.Title>
          {parseFloat(agency.total_revenue) > 0 ? (
            <Card.Text>
              Recaudación de {currentMonth}{" "}
              <div style={{ fontWeight: "bold" }}>
                {" "}
                {asMoney(agency.total_revenue)}
              </div>
            </Card.Text>
          ) : (
            <Card.Text style={{ fontStyle: "italic", color: "gray" }}>
              Sin recaudación
            </Card.Text>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="outline-danger" onClick={handleDeleteShow}>
              Dar de baja
            </Button>
          </div>
        </Card.Body>
      </Card>
      {showUpdateModal && (
        <AgencyUpdateModal
          agency={agency}
          handleClose={handleUpdateClose}
          show={showUpdateModal}
          onOk={reloadAgencies}
        />
      )}
      {showDeleteModal && (
        <AgencyDeleteModal
          agency={agency}
          handleClose={handleDeleteClose}
          show={showDeleteModal}
          onOk={reloadAgencies}
        />
      )}
    </div>
  );
}

function AgencyList({ agencies, ...rest }) {
  return agencies.map((agency) => (
    <Agency agency={agency} key={`agency-card${agency.id}`} {...rest} />
  ));
}

export function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [updateAgencies, setUpdateAgencies] = useState(false);
  const [handleClose, handleShow, show] = useModal();

  const reloadAgencies = () => setUpdateAgencies((prev) => !prev);
  useEffect(() => {
    getDetailedAgencies().then((response) => {
      console.log(response.data);
      setAgencies(response.data);
    });
  }, [updateAgencies]);

  return (
    <Page>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}
      >
        <AgencyList agencies={agencies} reloadAgencies={reloadAgencies} />
        <FAB onClick={handleShow} />
      </div>
      {show && (
        <AgencyCreateModal
          handleClose={handleClose}
          show={show}
          onOk={reloadAgencies}
        />
      )}
    </Page>
  );
}
