import React from "react";
import Card from "../../Card/Card";

const BasicCard: React.FC = () => {
  return (
    <Card>
      <h3 style={{ margin: "0 0 12px 0", color: "#1F2937" }}>Basic Card</h3>
      <p style={{ margin: "0", color: "#6B7280" }}>
        This is a simple card with basic content. Perfect for displaying text,
        images, or simple components.
      </p>
    </Card>
  );
};

export default BasicCard;
