import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/utils";
import Input from "./ui/Input";
import { Loader, Trash } from "lucide-react";

export interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "borderless";
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const InputForm = forwardRef<HTMLInputElement, InputFormProps>(
  (
    {
      variant = "default",
      label,
      isRequired = false,
      errorMessage,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      fullWidth = false,
      loading = false,
      clearable = false,
      onClear,
      className,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const inputId =
      props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const containerStyles = [
      "relative flex items-center",
      fullWidth ? "w-full" : "w-auto",
    ];

    const addonStyles =
      "px-3 bg-pink-50 border border-r-0 text-gray-500 text-sm flex items-center";

    const getPadding = () => {
      let paddingLeft = "";
      let paddingRight = "";

      if (leftIcon) paddingLeft = "pl-10";
      else if (leftAddon) paddingLeft = "pl-0";
      else paddingLeft = variant === "borderless" ? "pl-0" : "pl-4";

      if (rightIcon || loading || clearable) paddingRight = "pr-10";
      else if (rightAddon) paddingRight = "pr-0";
      else paddingRight = variant === "borderless" ? "pr-0" : "pr-4";

      return `${paddingLeft} ${paddingRight}`;
    };

    const showClearButton = clearable && value && !disabled && !loading;

    return (
      <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label} {isRequired && <span className="text-red-500"> *</span>}
          </label>
        )}

        <div className={cn(containerStyles)}>
          {leftAddon && (
            <div className={cn(addonStyles, "rounded-l-lg border-r-0")}>
              {leftAddon}
            </div>
          )}

          <div className="relative flex-1">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {leftIcon}
              </div>
            )}

            <Input
              ref={ref}
              id={inputId}
              className={cn([
                getPadding(),
                leftAddon && "rounded-l-none",
                rightAddon && "rounded-r-none",
                className,
              ])}
              disabled={disabled || loading}
              value={value}
              {...props}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading && <Loader className="animate-spin" />}

              {showClearButton && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}

              {!loading && rightIcon && (
                <div className="text-gray-400">{rightIcon}</div>
              )}
            </div>
          </div>

          {rightAddon && (
            <div className={cn(addonStyles, "rounded-r-lg border-l-0")}>
              {rightAddon}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="text-xs">
            <span className="text-red-600">{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }
);

InputForm.displayName = "Input";

export default InputForm;
