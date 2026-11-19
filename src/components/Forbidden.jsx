import { Container, Alert, Button } from "react-bootstrap";
import { PERMISSION_DENIED_MESSAGE } from "../constants";
import { getStoredUser } from "../store/local";
import { useNavigateByUserType } from "../routes/useNavigateByUserType";
import { ROUTES } from "../routes/constants";
import { useNavigate } from "react-router";

const Forbidden = () => {
  const user = getStoredUser();
  const navigateByUserType = useNavigateByUserType();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (user?.user_type) {
      navigateByUserType(user.user_type);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Alert variant="danger" className="text-center p-4 shadow-sm">
        <Alert.Heading>403 - Acceso denegado</Alert.Heading>
        <p className="mb-4">{PERMISSION_DENIED_MESSAGE}.</p>
        <Button variant="outline-danger" onClick={handleGoHome}>
          Volver al inicio
        </Button>
      </Alert>
    </Container>
  );
};

export default Forbidden;
