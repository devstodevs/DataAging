import React from "react";
import "./DateInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";

export interface DateInputProps
  extends Omit<BaseInputProps, "type" | "showValidationIcons"> {}

const DateInput: React.FC<DateInputProps> = (props) => {
  return <BaseInput {...props} type="date" showValidationIcons={false} />;
};

export default DateInput;
