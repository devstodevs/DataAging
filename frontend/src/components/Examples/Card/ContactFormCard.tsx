import React from "react";
import Card from "../../Card/Card";

const ContactFormCard: React.FC = () => {
  return (
    <Card>
      <h3 style={{ margin: "0 0 16px 0", color: "#1F2937" }}>Contact Form</h3>
      <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="Name"
          style={{
            padding: "8px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: "4px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          style={{
            padding: "8px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: "4px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
    </Card>
  );
};

export default ContactFormCard;
