import React from "react";

interface TitleProps {
  children: React.ReactNode;
  level?: "h1" | "h2";
  size?: "small" | "medium" | "large";
  align?: "left" | "center" | "right";
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  children,
  level = "h1",
  size,
  align = "left",
  className = "",
}) => {
  // Size configurations
  const getSizeConfig = () => {
    if (size) {
      switch (size) {
        case "small":
          return { fontSize: "20px", fontWeight: "600", htmlTag: "h3" as const };
        case "medium":
          return { fontSize: "24px", fontWeight: "600", htmlTag: "h2" as const };
        case "large":
          return { fontSize: "32px", fontWeight: "700", htmlTag: "h1" as const };
        default:
          return { fontSize: "24px", fontWeight: "600", htmlTag: "h2" as const };
      }
    }

    // Fallback to level-based configuration for backward compatibility
    return {
      fontSize: level === "h1" ? "32px" : "24px",
      fontWeight: level === "h1" ? "700" : "600",
      htmlTag: level,
    };
  };

  const sizeConfig = getSizeConfig();

  const baseStyle: React.CSSProperties = {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontWeight: sizeConfig.fontWeight,
    color: "#000000",
    fontSize: sizeConfig.fontSize,
    lineHeight: "1.2",
    margin: "0",
    textAlign: align,
    letterSpacing: "-0.025em",
  };

  const Component = sizeConfig.htmlTag;

  return (
    <Component className={`title-component ${className}`} style={baseStyle}>
      {children}
    </Component>
  );
};

export default Title;
