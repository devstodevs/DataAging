import React from "react";
import "./PhoneInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";
import { getMaskConfig } from "../shared";

export interface PhoneInputProps
  extends Omit<
    BaseInputProps,
    "type" | "mask" | "customErrorMessage" | "maxLength"
  > {}

const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder,
  autoComplete = "tel",
  ...props
}) => {
  const maskConfig = getMaskConfig("phone");
  const finalPlaceholder =
    maskConfig?.placeholder || placeholder || "(11) 99999-9999";

  return (
    <BaseInput
      {...props}
      type="tel"
      placeholder={finalPlaceholder}
      autoComplete={autoComplete}
      mask="phone"
      customErrorMessage="Formato inválido para telefone"
      maxLength={
        maskConfig?.maxFormattedLength || maskConfig?.placeholder.length
      }
    />
  );
};

export default PhoneInput;
