import React from "react";
import './Input.css';

const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  options = [],
  disabled = false,
  isSelect = false,
  isToggle = false,
  toggleValue,
  onToggleChange,
  min,
  max,
  step,
  info,
  ...props
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {isSelect ? (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full p-3 rounded-lg border border-gray-300 bg-white shadow-sm 
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : isToggle ? (
        <div className="flex items-center gap-4">
          <span>{label}</span>
          <button
            type="button"
            className={`w-14 h-8 rounded-full flex items-center px-1 shadow-inner transition-all 
              ${toggleValue ? "bg-blue-500 justify-end" : "bg-gray-300 justify-start"}`}
            onClick={onToggleChange}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={`w-full p-3 rounded-lg border border-gray-300 bg-white shadow-sm 
              focus:ring-2 focus:ring-blue-500 focus:outline-none
              ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            {...props}
          />
        </div>
      )}
      {info && <small className="block text-gray-500 mt-1">{info}</small>}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Input;
