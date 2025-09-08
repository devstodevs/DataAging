import React from "react";
import "./PasswordInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";

export interface PasswordInputProps
  extends Omit<BaseInputProps, "type" | "icon" | "onIconClick"> {}

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
