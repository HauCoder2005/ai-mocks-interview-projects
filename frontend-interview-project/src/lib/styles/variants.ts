import { appTheme } from "@/lib/styles/theme";

export const focusRingClass =
  "outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export const fieldBaseClass = [
  "w-full border bg-white px-3 text-sm text-slate-950 placeholder:text-slate-400",
  appTheme.colors.border,
  appTheme.radius.md,
  focusRingClass,
].join(" ");

export const buttonVariants = {
  variant: {
    primary: [
      appTheme.colors.primary,
      appTheme.colors.primaryHover,
      "text-white",
    ].join(" "),
    secondary:
      "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    outline:
      "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    danger: [appTheme.colors.danger, "text-white hover:bg-red-700"].join(" "),
  },
  size: {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  },
};

export const badgeVariants = {
  default: "bg-slate-100 text-slate-700",
  primary: "bg-blue-50 text-blue-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
  warning: "bg-amber-50 text-amber-700",
};
