import type { ReactNode } from "react";

import { AppShell } from "@/components/layouts/app-shell";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
