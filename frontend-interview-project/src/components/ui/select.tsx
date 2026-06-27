import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import { fieldBaseClass } from "@/lib/styles/variants";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
    <select
      className={cn("h-10", fieldBaseClass, className)}
      ref={ref}
      {...props}
    />
  ),
);

Select.displayName = "Select";
