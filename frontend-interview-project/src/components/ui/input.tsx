import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import { fieldBaseClass } from "@/lib/styles/variants";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      className={cn("h-10", fieldBaseClass, className)}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = "Input";
