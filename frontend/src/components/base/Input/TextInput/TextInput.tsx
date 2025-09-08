import React from "react";
import "./TextInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";

export interface TextInputProps extends Omit<BaseInputProps, "type"> {}

const TextInput: React.FC<TextInputProps> = (props) => {
  return <BaseInput {...props} type="text" />;
};

export default TextInput;
