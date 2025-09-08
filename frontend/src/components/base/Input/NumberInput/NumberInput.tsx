import React from "react";
import "./NumberInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";

export interface NumberInputProps
  extends Omit<BaseInputProps, "type" | "showValidationIcons"> {}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  return <BaseInput {...props} type="number" showValidationIcons={false} />;
};

export default NumberInput;
