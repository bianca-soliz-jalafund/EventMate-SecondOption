import { RefreshCcw } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "destructive";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  variant = "primary",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = [
    "px-4 py-2 inline-flex items-center justify-center gap-2",
    "font-medium rounded-lg transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    fullWidth && "w-full",
  ];

  const variantStyles = {
    primary: [
      "bg-black hover:bg-pink-800 active:bg-pink-900",
      "text-white border border-transparent",
      "shadow-md hover:shadow-lg",
      "focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1",
    ],
    secondary: [
      "bg-pink-100 hover:bg-pink-200 active:bg-pink-300",
      "text-pink-800 border border-pink-400",
      "shadow-sm hover:shadow-md",
      "focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1",
    ],
    tertiary: [
      "bg-transparent hover:bg-pink-100 active:bg-pink-200",
      "text-pink-700 border border-transparent",
      "focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-1",
    ],
    ghost: [
      "bg-transparent hover:bg-pink-50 active:bg-pink-100",
      "text-pink-700 hover:text-pink-900",
      "border border-transparent",
      "focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-1",
    ],
    destructive: [
      "bg-red-600 hover:bg-red-700 active:bg-red-800",
      "text-white border border-transparent",
      "shadow-md hover:shadow-lg",
      "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1",
    ],
  };

  return (
    <button
      className={cn([...baseStyles, ...variantStyles[variant], className])}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <RefreshCcw className="animate-spin h-4 w-4" />}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
