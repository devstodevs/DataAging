import React from "react";

interface TitleProps {
  children: React.ReactNode;
  level?: "h1" | "h2";
  align?: "left" | "center" | "right";
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  children,
  level = "h1",
  align = "left",
  className = "",
}) => {
  const baseStyle: React.CSSProperties = {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontWeight: level === "h1" ? "700" : "600",
    color: "#000000",
    fontSize: level === "h1" ? "32px" : "24px",
    lineHeight: "1.2",
    margin: "0",
    textAlign: align,
    letterSpacing: "-0.025em",
  };

  const Component = level;

  return (
    <Component className={`title-component ${className}`} style={baseStyle}>
      {children}
    </Component>
  );
};

export default Title;
