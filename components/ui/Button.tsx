import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-luxury px-6 py-3 transition-all duration-300 font-medium",

        variant === "primary" &&
          "bg-primary text-white hover:opacity-90",

        variant === "secondary" &&
          "bg-secondary text-dark hover:opacity-90",

        variant === "outline" &&
          "border border-primary text-primary hover:bg-primary hover:text-white",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}