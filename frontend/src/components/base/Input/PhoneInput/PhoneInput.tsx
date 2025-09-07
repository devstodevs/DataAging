import React from "react";
import "./PhoneInput.css";
import BaseInput from "../BaseInput";
import { getMaskConfig } from "../shared";

export interface PhoneInputProps {
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
  disableSuccessValidation?: boolean;
}

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
