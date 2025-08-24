export interface MaskConfig {
  mask: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  maxFormattedLength?: number;
}

export const MASKS: Record<string, MaskConfig> = {
  phone: {
    mask: "(99) 99999-9999",
    minLength: 10,
    maxLength: 11,
    placeholder: "(11) 99999-9999",
  },
  cpf: {
    mask: "999.999.999-99",
    minLength: 11,
    maxLength: 11,
    placeholder: "000.000.000-00",
  },
  cnpj: {
    mask: "99.999.999/9999-99",
    minLength: 14,
    maxLength: 14,
    placeholder: "00.000.000/0000-00",
  },
  cep: {
    mask: "99999-999",
    minLength: 8,
    maxLength: 8,
    placeholder: "00000-000",
  },
  currency: {
    mask: "R$ 9.999,99",
    minLength: 1,
    maxLength: 10,
    placeholder: "R$ 0,00",
    maxFormattedLength: 15,
  },
};

export const applyMask = (value: string, maskType: string): string => {
  if (!maskType || !MASKS[maskType]) return value;

  const numbers = value.replace(/\D/g, "");
  const config = MASKS[maskType];

  if (numbers.length > config.maxLength) {
    return value;
  }

  switch (maskType) {
    case "phone":
      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d{0,4})(\d{0,4})/, "($1) $2-$3")
          .trim();
      } else {
        return numbers
          .replace(/(\d{2})(\d{0,5})(\d{0,4})/, "($1) $2-$3")
          .trim();
      }
    case "cpf":
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    case "cnpj":
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    case "cep":
      return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
    case "currency":
      if (numbers.length === 0) return "";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(numbers) / 100);
    default:
      return value;
  }
};

export const validateMask = (value: string, maskType: string): boolean => {
  if (!maskType || !MASKS[maskType]) return true;

  const numbers = value.replace(/\D/g, "");
  const config = MASKS[maskType];

  // For validation, we check the actual number of digits
  // minLength and maxLength in config represent the number of digits, not the formatted length
  return (
    numbers.length >= config.minLength && numbers.length <= config.maxLength
  );
};

export const getMaskConfig = (maskType: string): MaskConfig | null => {
  return MASKS[maskType] || null;
};
