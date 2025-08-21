import React from "react";

interface SubtitleProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  size?: "small" | "medium" | "large";
  className?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({
  children,
  align = "left",
  size = "medium",
  className = "",
}) => {
  const getFontSize = () => {
    switch (size) {
      case "small":
        return "14px";
      case "large":
        return "16px";
      default:
        return "15px";
    }
  };

  const baseStyle: React.CSSProperties = {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontWeight: "400",
    color: "#4A4A4A",
    fontSize: getFontSize(),
    lineHeight: "1.5",
    margin: "0",
    textAlign: align,
    letterSpacing: "0.01em",
  };

  return (
    <p className={`subtitle-component ${className}`} style={baseStyle}>
      {children}
    </p>
  );
};

export default Subtitle;
