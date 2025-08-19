import React from "react";
import Card from "../../Card/Card";

const ActionCard: React.FC = () => {
  return (
    <Card>
      <h3 style={{ margin: "0 0 16px 0", color: "#1F2937" }}>Action Card</h3>
      <p style={{ margin: "0 0 16px 0", color: "#6B7280" }}>
        Cards can contain action buttons and interactive elements.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          style={{
            padding: "6px 12px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Primary
        </button>
        <button
          style={{
            padding: "6px 12px",
            backgroundColor: "transparent",
            color: "#6B7280",
            border: "1px solid #D1D5DB",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Secondary
        </button>
      </div>
    </Card>
  );
};

export default ActionCard;
