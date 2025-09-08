import React from "react";
import "./CEPInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";
import { getMaskConfig } from "../shared";

export interface CEPInputProps
  extends Omit<
    BaseInputProps,
    "type" | "mask" | "customErrorMessage" | "maxLength"
  > {}

const CEPInput: React.FC<CEPInputProps> = ({
  placeholder,
  autoComplete = "postal-code",
  ...props
}) => {
  const maskConfig = getMaskConfig("cep");
  const finalPlaceholder =
    maskConfig?.placeholder || placeholder || "00000-000";

  return (
    <BaseInput
      {...props}
      type="text"
      placeholder={finalPlaceholder}
      autoComplete={autoComplete}
      mask="cep"
      customErrorMessage="Formato inválido para CEP"
      maxLength={
        maskConfig?.maxFormattedLength || maskConfig?.placeholder.length
      }
    />
  );
};

export default CEPInput;
