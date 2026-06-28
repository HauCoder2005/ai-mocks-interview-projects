import type { ReactNode } from "react";

import { UserShell } from "@/components/layouts/user-shell";

type UserLayoutProps = {
  children: ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
  return <UserShell>{children}</UserShell>;
}
