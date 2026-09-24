import { Container } from "react-bootstrap";

export function AdminTable({ label, emptyLabel, items, Child }) {
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
        {label}
      </div>
      <Container>
        {items.length === 0 && (
          <div
            style={{
              fontStyle: "italic",
              textAlign: "center",
              color: "gray",
            }}
          >
            {emptyLabel}
          </div>
        )}
        {items.map((item) => (
          <Child item={item} />
        ))}
      </Container>
    </div>
  );
}
