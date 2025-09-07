import React from "react";
import "./TextInput.css";
import BaseInput from "../BaseInput";

export interface TextInputProps {
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
  pattern?: string;
  disableSuccessValidation?: boolean;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  return <BaseInput {...props} type="text" />;
};

export default TextInput;
