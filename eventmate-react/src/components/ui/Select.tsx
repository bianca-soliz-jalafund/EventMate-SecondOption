import type { InputHTMLAttributes } from "react";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
}

const Select = ({ label, value, onChange, options, error }: SelectProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-pink-900 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg bg-pink-50 text-pink-900 placeholder:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors ${
          error ? "border-red-500" : "border-pink-400"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
