import React from "react";
import "./NumberInput.css";
import BaseInput from "../BaseInput";

export interface NumberInputProps {
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
  min?: number;
  max?: number;
  step?: number;
  disableSuccessValidation?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  return <BaseInput {...props} type="number" showValidationIcons={false} />;
};

export default NumberInput;
