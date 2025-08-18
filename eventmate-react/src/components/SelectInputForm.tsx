import type { ReactNode, SelectHTMLAttributes } from "react";

interface SelectInputFormProps extends SelectHTMLAttributes<HTMLSelectElement> {
  errorMessage?: string;
  label: string;
  isRequired?: boolean;
  prompt?: string;
  renderOptions?: () => ReactNode[];
}

const SelectInputForm = ({
  errorMessage,
  label,
  isRequired = false,
  renderOptions,
  prompt,
  ...props
}: SelectInputFormProps) => {
  const inputId =
    props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-900 mb-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <select
        id={inputId}
        {...props}
        className={`w-full px-3 py-2 rounded-lg border transition-colors
          ${errorMessage ? "border-red-500" : "border-pink-400"}
          focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600
          bg-pink-100 text-gray-900`}
      >
        <option value="">{prompt || "Select an option..."}</option>
        {renderOptions && renderOptions()}
      </select>
      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectInputForm;
