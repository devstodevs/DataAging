import React from "react";
import "./Button.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  href?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  type = "button",
  href,
  variant = "primary",
  className = "",
}) => {
  const isDisabled = disabled || loading;

  const buttonClasses = [
    "primary-button",
    variant,
    fullWidth ? "full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div className="loading-spinner" />
          <span>Carregando...</span>
        </>
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === "left" && icon}
          <span>{children}</span>
          {iconPosition === "right" && icon}
        </>
      );
    }

    return <span>{children}</span>;
  };

  const commonProps = {
    className: buttonClasses,
    disabled: isDisabled,
  };

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} {...commonProps}>
      {renderContent()}
    </button>
  );
};

export default Button;
