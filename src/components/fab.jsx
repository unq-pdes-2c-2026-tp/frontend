import Button from "react-bootstrap/Button";

const styles = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "60px",
  height: "60px",
  borderRadius: "50px",
  fontSize: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1050,
};

function FAB(props) {
  return (
    <Button variant="primary" style={styles} {...props}>
      +
    </Button>
  );
}

export default FAB;
