import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", onChange, onInput, ...props }, ref) => {
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      if (/^0\d+/.test(val)) {
        val = String(parseInt(val, 10));
        e.target.value = val;
      }

      onChange?.(e);
    };

    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
      ...props,
      type,
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
    };

    if (type === "number") {
      return (
        <input
          {...inputProps}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={handleNumberInput}
        />
      );
    }

    return <input {...inputProps} onChange={onChange} onInput={onInput} />;
  }
);

Input.displayName = "Input";

export { Input };
