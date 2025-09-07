import { useState, useCallback } from "react";
import { applyMask, validateMask } from "./masks";
import { isSpecialInputType, buildClassNames } from "./utils";

export interface UseInputProps {
  value?: string;
  onChange?: (value: string) => void;
  mask?: string;
  type?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  iconPosition?: "left" | "right";
}

export interface UseInputReturn {
  value: string;
  isFocused: boolean;
  showPassword: boolean;
  hasError: boolean;
  hasSuccess: boolean;
  isValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  togglePasswordVisibility: () => void;
  getInputType: (type: string) => string;
  hasRightIcon: boolean;
  inputClasses: string;
}

export const useInput = ({
  value = "",
  onChange,
  mask,
  type = "text",
  error,
  success = false,
  iconPosition = "right",
}: UseInputProps): UseInputReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        let newValue = e.target.value;

        if (mask && !isSpecialInputType(type)) {
          newValue = applyMask(newValue, mask);
        }

        onChange(newValue);
      }
    },
    [onChange, mask, type]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const getInputType = useCallback(
    (type: string) => {
      if (type === "password") {
        return showPassword ? "text" : "password";
      }
      return type;
    },
    [showPassword]
  );

  const isSpecialType = isSpecialInputType(type);
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success && !error);
  const isValid = mask && !isSpecialType ? validateMask(value, mask) : true;
  const hasRightIcon = Boolean(
    iconPosition === "right" &&
    ((mask && !isSpecialType) || error || (success && !isSpecialType) || type === "password")
  );

  const inputClasses = buildClassNames(
    "input-field",
    hasError && "error",
    hasSuccess && "success",
    isFocused && "focused",
    hasRightIcon && "has-right-icon"
  );

  return {
    value,
    isFocused,
    showPassword,
    hasError,
    hasSuccess,
    isValid,
    handleChange,
    handleFocus,
    handleBlur,
    togglePasswordVisibility,
    getInputType,
    hasRightIcon,
    inputClasses,
  };
};
