import React, { useState, useCallback, useEffect, ReactNode } from "react";

interface ExampleContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  size?: "small" | "medium" | "large" | "full";
  resizable?: boolean;
  minWidth?: string;
  maxWidth?: string;
  className?: string;
}

const ExampleContainer: React.FC<ExampleContainerProps> = ({
  children,
  title,
  description,
  size = "medium",
  resizable = true,
  minWidth = "300px",
  maxWidth = "100%",
  className = "",
}) => {
  const [width, setWidth] = useState<string>(() => {
    switch (size) {
      case "small":
        return "300px";
      case "large":
        return "800px";
      case "full":
        return "100%";
      default:
        return "500px";
    }
  });

  const getSizeName = (currentWidth: string): string => {
    const widthNum = parseInt(currentWidth);
    if (currentWidth === "100%") return "full";
    if (widthNum <= 350) return "small";
    if (widthNum <= 600) return "medium";
    if (widthNum <= 900) return "large";
    return "extra-large";
  };

  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX - 40; // 40px offset for padding
    if (newWidth > parseInt(minWidth) && newWidth < window.innerWidth - 80) {
      setWidth(`${newWidth}px`);
    }
  }, [isResizing, minWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const containerStyle: React.CSSProperties = {
    width: width,
    minWidth: minWidth,
    maxWidth: maxWidth,
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    position: "relative",
    transition: isResizing ? "none" : "width 0.2s ease",
  };

  const resizeHandleStyle: React.CSSProperties = {
    position: "absolute",
    right: "-4px",
    top: "0",
    bottom: "0",
    width: "8px",
    cursor: "ew-resize",
    backgroundColor: "transparent",
    zIndex: 10,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid #F3F4F6",
  };

  const titleStyle: React.CSSProperties = {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1F2937",
  };

  const descriptionStyle: React.CSSProperties = {
    margin: "0",
    fontSize: "14px",
    color: "#6B7280",
  };

  const sizeIndicatorStyle: React.CSSProperties = {
    position: "absolute",
    top: "8px",
    right: "8px",
    fontSize: "12px",
    color: "#9CA3AF",
    backgroundColor: "#F3F4F6",
    padding: "2px 6px",
    borderRadius: "4px",
  };

  return (
    <div className={`example-container ${className}`} style={containerStyle}>
      {resizable && (
        <div
          style={resizeHandleStyle}
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        />
      )}

      <div style={sizeIndicatorStyle}>
        {getSizeName(width)} ({width})
      </div>

      {(title || description) && (
        <div style={headerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {description && <p style={descriptionStyle}>{description}</p>}
        </div>
      )}

      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

export default ExampleContainer;
