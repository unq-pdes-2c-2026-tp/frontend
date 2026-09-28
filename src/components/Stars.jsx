import { FaStar } from "react-icons/fa";

export function Stars({ amount }) {
  return (
    <div>
      <FaStar color="orange" />
      {amount}/10
    </div>
  );
}

export function GrayStar() {
  return <FaStar color="gray" />;
}
