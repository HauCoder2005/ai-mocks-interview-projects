import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import { fieldBaseClass } from "@/lib/styles/variants";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <textarea
      className={cn("min-h-28 py-2", fieldBaseClass, className)}
      ref={ref}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
