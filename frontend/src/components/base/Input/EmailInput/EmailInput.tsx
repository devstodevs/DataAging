import React from "react";
import "./EmailInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";

export type EmailInputProps = Omit<
  BaseInputProps,
  "type" | "customValidation" | "customErrorMessage"
>;

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
