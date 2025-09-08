import React from "react";
import "./CurrencyInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";
import { getMaskConfig } from "../shared";

export interface CurrencyInputProps
  extends Omit<
    BaseInputProps,
    "type" | "mask" | "customErrorMessage" | "maxLength"
  > {}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  placeholder,
  ...props
}) => {
  const maskConfig = getMaskConfig("currency");
  const finalPlaceholder = maskConfig?.placeholder || placeholder || "R$ 0,00";

  return (
    <BaseInput
      {...props}
      type="text"
      placeholder={finalPlaceholder}
      mask="currency"
      customErrorMessage="Formato inválido para valor monetário"
      maxLength={maskConfig?.maxFormattedLength || 15}
    />
  );
};

export default CurrencyInput;
