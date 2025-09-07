import React from "react";
import "./PasswordInput.css";
import BaseInput from "../BaseInput";

export interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  success?: boolean;
  iconPosition?: "left" | "right";
  className?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  disableSuccessValidation?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = "Digite sua senha",
  autoComplete = "current-password",
  ...props
}) => {
  return (
    <BaseInput
      {...props}
      type="password"
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
  );
};

export default PasswordInput;
