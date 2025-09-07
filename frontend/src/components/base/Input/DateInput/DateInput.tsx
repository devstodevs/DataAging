import React from "react";
import "./DateInput.css";
import BaseInput from "../BaseInput";

export interface DateInputProps {
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
  min?: string;
  max?: string;
  disableSuccessValidation?: boolean;
}

const DateInput: React.FC<DateInputProps> = (props) => {
  return <BaseInput {...props} type="date" showValidationIcons={false} />;
};

export default DateInput;
