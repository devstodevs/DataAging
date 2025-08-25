import React from "react";
import Card from "../../base/Card/Card";

const UserProfileCard: React.FC = () => {
  return (
    <Card>
      <h3 style={{ margin: "0 0 16px 0", color: "#1F2937" }}>User Profile</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#3B82F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          JD
        </div>
        <div>
          <h4 style={{ margin: "0", color: "#1F2937" }}>John Doe</h4>
          <p style={{ margin: "0", color: "#6B7280", fontSize: "14px" }}>
            Software Developer
          </p>
        </div>
      </div>
      <p style={{ margin: "0", color: "#6B7280" }}>
        Passionate about creating beautiful and functional user interfaces.
      </p>
    </Card>
  );
};

export default UserProfileCard;
