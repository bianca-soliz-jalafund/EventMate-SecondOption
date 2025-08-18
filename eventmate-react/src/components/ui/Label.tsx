import { cn } from "@/utils/utils";
import type { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = ({ required, className, children, ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={cn(
        "block text-sm font-medium text-pink-900 mb-1",
        className
      )}
    >
      {children} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
