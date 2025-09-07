import React from "react";
import "./DocumentInput.css";
import BaseInput from "../BaseInput";
import { getMaskConfig } from "../shared";

export type DocumentType = "cpf" | "cnpj";

export interface DocumentInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  documentType?: DocumentType;
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

const DocumentInput: React.FC<DocumentInputProps> = ({
  placeholder,
  documentType = "cpf",
  ...props
}) => {
  const maskConfig = getMaskConfig(documentType);
  const finalPlaceholder = maskConfig?.placeholder || placeholder;
  const getDocumentTypeLabel = () => {
    return documentType === "cpf" ? "CPF" : "CNPJ";
  };

  return (
    <BaseInput
      {...props}
      type="text"
      placeholder={finalPlaceholder}
      mask={documentType}
      customErrorMessage={`Formato inválido para ${getDocumentTypeLabel()}`}
      maxLength={
        maskConfig?.maxFormattedLength || maskConfig?.placeholder.length
      }
    />
  );
};

export default DocumentInput;
