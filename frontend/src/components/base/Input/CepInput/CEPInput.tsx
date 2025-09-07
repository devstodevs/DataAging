import React from "react";
import "./CEPInput.css";
import BaseInput from "../BaseInput";
import { getMaskConfig } from "../shared";

export interface CEPInputProps {
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
