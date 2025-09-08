import React from "react";
import "./DocumentInput.css";
import BaseInput, { type BaseInputProps } from "../BaseInput";
import { getMaskConfig } from "../shared";

export type DocumentType = "cpf" | "cnpj";

export interface DocumentInputProps
  extends Omit<
    BaseInputProps,
    "type" | "mask" | "customErrorMessage" | "maxLength"
  > {
  documentType?: DocumentType;
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
