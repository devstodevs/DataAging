import React, { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  maxWidth = "400px",
}) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        maxWidth,
        width: "100%",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
