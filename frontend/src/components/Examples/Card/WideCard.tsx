import React from "react";
import Card from "../../Card/Card";

const WideCard: React.FC = () => {
  return (
    <Card maxWidth="600px">
      <h3 style={{ margin: "0 0 16px 0", color: "#1F2937" }}>Wide Card</h3>
      <p style={{ margin: "0", color: "#6B7280" }}>
        This card has a custom max-width of 600px, making it wider than the
        default 400px. Useful for content that needs more horizontal space.
      </p>
    </Card>
  );
};

export default WideCard;
