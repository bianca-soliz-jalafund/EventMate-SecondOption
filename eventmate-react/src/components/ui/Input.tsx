import { cn } from "@/utils/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "borderless";
  label?: string;
  errorMessage?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", className, disabled, value, ...props }, ref) => {
    const inputId =
      props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const variantStyles = {
      default: [
        "border rounded-lg bg-pink-100",
        "focus:ring-black focus:border-black",
      ],
      filled: [
        "border border-transparent rounded-lg bg-pink-100",
        "focus:ring-black focus:bg-pink-100 focus:border-pink-400",
        "hover:bg-pink-50",
      ],
      borderless: [
        "border-0 border-b-2 rounded-none bg-transparent",
        "focus:ring-0 focus:border-black",
        "px-0",
      ],
    };

    return (
      <input
        ref={ref}
        id={inputId}
        className={`input-base-style ${cn([
          ...variantStyles[variant],
          className,
        ])}`}
        disabled={disabled}
        value={value}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
