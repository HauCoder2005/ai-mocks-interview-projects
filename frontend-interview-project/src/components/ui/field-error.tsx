import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type FieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  message?: string;
};

export function FieldError({ className, message, ...props }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className={cn("text-sm text-red-600", className)} {...props}>
      {message}
    </p>
  );
}
