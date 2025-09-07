import React from "react";
import "./EmailInput.css";
import BaseInput from "../BaseInput";

export interface EmailInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
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
  disableSuccessValidation?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  placeholder = "Digite seu email",
  autoComplete = "email",
  ...props
}) => {
  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <BaseInput
      {...props}
      type="email"
      placeholder={placeholder}
      autoComplete={autoComplete}
      customValidation={isValidEmail}
      customErrorMessage="Email inválido"
    />
  );
};

export default EmailInput;
