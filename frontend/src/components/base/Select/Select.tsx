import React from "react";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  name?: string;
  id?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Selecione...",
  value = "",
  onChange,
  options,
  disabled = false,
  required = false,
  error,
  className = "",
  name,
  id,
}) => {
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  const selectClasses = [
    "select-input",
    error ? "error" : "",
    disabled ? "disabled" : "",
    !value ? "placeholder" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="select-container">
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="select-wrapper">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="select-arrow">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {error && <div className="select-error">{error}</div>}
    </div>
  );
};

export default Select;
