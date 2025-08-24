import React from "react";
import "./Input.css";
import { useInput } from "./useInput";
import { getMaskConfig } from "./masks";
import { ICONS } from "./icons";
import { generateInputId, buildClassNames, isSpecialInputType, shouldShowValidationIcons } from "./utils";

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "password" | "tel" | "date" | "number";
  disabled?: boolean;
  required?: boolean;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onIconClick?: () => void;
  className?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  mask?: "phone" | "cpf" | "cnpj" | "cep" | "currency";
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value = "",
  onChange,
  type = "text",
  disabled = false,
  required = false,
  error,
  success = false,
  icon,
  iconPosition = "right",
  onIconClick,
  className = "",
  name,
  id,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  mask,
}) => {
  const inputId = generateInputId(id, name);
  const maskConfig = mask ? getMaskConfig(mask) : null;
  const finalPlaceholder = maskConfig?.placeholder || placeholder;
  const isSpecialType = isSpecialInputType(type);
  const hasValue = value.length > 0;
  const showValidationIcons = shouldShowValidationIcons(type, value);

  const finalMaxLength =
    maxLength ||
    (maskConfig && !isSpecialType
      ? maskConfig.maxFormattedLength || maskConfig.placeholder.length
      : undefined);

  const {
    handleChange,
    handleFocus,
    handleBlur,
    togglePasswordVisibility,
    getInputType,
    inputClasses,
    showPassword,
    isValid,
  } = useInput({
    value,
    onChange,
    mask,
    type,
    required,
    error,
    success,
    iconPosition,
  });

  const renderIcon = (iconType: "password" | "success" | "error" | "custom") => {
    const iconProps = {
      password: {
        condition: type === "password",
        element: "button" as const,
        className: "input-icon password-toggle",
        onClick: togglePasswordVisibility,
        tabIndex: -1,
        icon: showPassword ? ICONS.eyeClosed : ICONS.eyeOpen,
      },
      success: {
        condition: (success || isValid) && !error && showValidationIcons,
        element: "div" as const,
        className: "input-icon success-icon",
        icon: ICONS.success,
      },
      error: {
        condition: (error || (hasValue && !isValid && mask)) && showValidationIcons,
        element: "div" as const,
        className: "input-icon error-icon",
        icon: ICONS.error,
      },
      custom: {
        condition: icon && !error && !success && type !== "password",
        element: "button" as const,
        className: `input-icon custom-icon ${onIconClick ? "clickable" : ""}`,
        onClick: onIconClick,
        tabIndex: onIconClick ? 0 : -1,
        icon,
      },
    };

    const config = iconProps[iconType];
    if (!config.condition) return null;

    const Element = config.element;
    const commonProps = {
      className: config.className,
      ...(config.onClick && { onClick: config.onClick }),
      ...(config.tabIndex !== undefined && { tabIndex: config.tabIndex }),
      ...(config.element === "button" && { type: "button" as const }),
    };

    return <Element {...commonProps}>{config.icon}</Element>;
  };

  const finalInputClasses = buildClassNames(
    inputClasses,
    disabled && "disabled",
    iconPosition === "left" && "icon-left",
    className
  );

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {iconPosition === "left" && (
          <>
            {renderIcon("password")}
            {renderIcon("custom")}
          </>
        )}

        <input
          id={inputId}
          name={name}
          type={getInputType(type)}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={finalPlaceholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={finalMaxLength}
          minLength={minLength}
          pattern={pattern}
          className={finalInputClasses}
        />

        {iconPosition === "right" && (
          <>
            {renderIcon("password")}
            {renderIcon("success")}
            {renderIcon("error")}
            {renderIcon("custom")}
          </>
        )}
      </div>

      {(error || (hasValue && !isValid && mask && !isSpecialType)) && (
        <div className="input-error">
          {error || `Formato inválido para ${mask}`}
        </div>
      )}
    </div>
  );
};

export default Input;
