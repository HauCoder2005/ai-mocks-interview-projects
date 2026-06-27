import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";
import { appTheme } from "@/lib/styles/theme";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        appTheme.radius.lg,
        appTheme.colors.border,
        appTheme.colors.surface,
        appTheme.shadow.sm,
        "border",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-slate-100 p-5", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}
