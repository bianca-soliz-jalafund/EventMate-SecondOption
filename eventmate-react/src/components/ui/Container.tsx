import { cn } from "@/utils/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CenterContainer = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-4",
        className
      )}
    >
      {children}
    </div>
  );
};
