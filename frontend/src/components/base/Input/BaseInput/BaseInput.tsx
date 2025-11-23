import React from "react";
import "./BaseInput.css";
import { useInput } from "../shared";
import {
  generateInputId,
  buildClassNames,
  shouldShowValidationIcons,
} from "../shared";
import { ICONS } from "../shared";

export interface BaseInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
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
  min?: string | number;
  max?: string | number;
  step?: number;
  mask?: string;
  // Custom validation function
  customValidation?: (value: string) => boolean;
  // Custom error message
  customErrorMessage?: string;
  // Whether to show validation icons
  showValidationIcons?: boolean;
  // Whether to disable success validation (hide success icon and styling)
  disableSuccessValidation?: boolean;
}

const BaseInput: React.FC<BaseInputProps> = ({
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
  min,
  max,
  step,
  mask,
  customValidation,
  customErrorMessage,
  showValidationIcons,
  disableSuccessValidation = false,
}) => {
  const inputId = generateInputId(id, name);
  const hasValue = value.length > 0;
  const shouldShowIcons =
    showValidationIcons ?? shouldShowValidationIcons(type, value);

  const {
    handleChange,
    handleFocus,
    handleBlur,
    togglePasswordVisibility,
    getInputType,
    inputClasses,
    showPassword,
    isValid: maskValid,
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

  // Use custom validation if provided, otherwise use mask validation
  const isValid = customValidation ? customValidation(value) : maskValid;

  const renderIcon = (
    iconType: "password" | "success" | "error" | "custom"
  ) => {
    if (iconType === "password" && type === "password") {
      return (
        <button
          type="button"
          className="input-icon password-toggle"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? ICONS.eyeClosed : ICONS.eyeOpen}
        </button>
      );
    }

    if (
      iconType === "success" &&
      (success || isValid) &&
      !error &&
      shouldShowIcons &&
      !disableSuccessValidation
    ) {
      return (
        <div className="input-icon success-icon">
          {ICONS.success}
        </div>
      );
    }

    if (
      iconType === "error" &&
      (error || (hasValue && !isValid)) &&
      shouldShowIcons
    ) {
      return (
        <div className="input-icon error-icon">
          {ICONS.error}
        </div>
      );
    }

    if (
      iconType === "custom" &&
      icon &&
      !error &&
      !success &&
      type !== "password"
    ) {
      return (
        <button
          type="button"
          className={`input-icon custom-icon ${onIconClick ? "clickable" : ""}`}
          onClick={onIconClick}
          tabIndex={onIconClick ? 0 : -1}
        >
          {icon}
        </button>
      );
    }

    return null;
  };

  const hasPasswordIcon = type === "password";
  const passwordIconOnLeft = hasPasswordIcon && iconPosition === "left";
  const passwordIconOnRight = hasPasswordIcon && iconPosition === "right";

  const hasRightIcon =
    passwordIconOnRight ||
    (iconPosition === "right" &&
      (icon ||
        (shouldShowIcons &&
          ((success && !disableSuccessValidation) || error)))) ||
    (shouldShowIcons && ((success && !disableSuccessValidation) || error));
  const hasLeftIcon =
    passwordIconOnLeft ||
    (iconPosition === "left" && icon && type !== "password");

  const finalInputClasses = buildClassNames(
    inputClasses,
    disabled ? "disabled" : undefined,
    hasLeftIcon ? "icon-left" : undefined,
    hasRightIcon ? "has-right-icon" : undefined,
    className
  );

  const getErrorMessage = () => {
    if (error) return error;
    if (customErrorMessage && hasValue && !isValid) return customErrorMessage;
    if (mask && hasValue && !isValid) return `Formato inválido para ${mask}`;
    return null;
  };

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
            {type === "password" && renderIcon("password")}
            {type !== "password" && renderIcon("custom")}
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
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          min={min}
          max={max}
          step={step}
          className={finalInputClasses}
        />

        {/* Right side icons */}
        {iconPosition === "right" && (
          <>
            {type === "password" && renderIcon("password")}
            {type !== "password" && (
              <>
                {renderIcon("success")}
                {renderIcon("error")}
                {renderIcon("custom")}
              </>
            )}
          </>
        )}

        {/* Validation icons for non-password fields when iconPosition is not explicitly right */}
        {type !== "password" && iconPosition !== "right" && (
          <>
            {renderIcon("success")}
            {renderIcon("error")}
          </>
        )}
      </div>

      {getErrorMessage() && (
        <div className="input-error">{getErrorMessage()}</div>
      )}
    </div>
  );
};

export default BaseInput;
