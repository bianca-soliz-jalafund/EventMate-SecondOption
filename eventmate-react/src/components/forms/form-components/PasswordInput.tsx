import { cn } from "@/utils/utils";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import InputForm, { type InputFormProps } from "../../InputForm";

interface PasswordInputProps<T extends FieldValues> extends InputFormProps {
  register: UseFormRegister<T>;
  keyName?: Path<T>;
}

const PasswordInput = <T extends FieldValues>({
  register,
  keyName = "password" as Path<T>,
  ...props
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <InputForm
        {...register(keyName)}
        label={props.label}
        type={showPassword ? "text" : "password"}
        placeholder={props.placeholder}
        leftIcon={<Lock className="h-4 w-4 text-pink-600" />}
        errorMessage={props.errorMessage}
        fullWidth
        className={cn("transition-all duration-200", props.className)}
      />

      <div className="absolute right-3 top-[43px] -translate-y-1/2">
        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className={cn(
            "p-2 text-gray-400 hover:text-pink-600",
            "transition-colors duration-200 active:scale-95 transform"
          )}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
