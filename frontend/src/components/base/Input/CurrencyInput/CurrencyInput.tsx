import React from "react";
import "./CurrencyInput.css";
import BaseInput from "../BaseInput";
import { getMaskConfig } from "../shared";

export interface CurrencyInputProps {
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
