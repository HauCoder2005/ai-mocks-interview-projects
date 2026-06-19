import type { Metadata } from "next";
import React from "react";

import Navbar from "@/src/components/common/Navbar";
import QueryProvider from "@/src/providers/QueryProvider";

import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "AI Mock Interview",
  description: "AI mock interview frontend",
};

/**
 * Defines the application shell shared by every App Router route.
 *
 * @param props - Root layout props supplied by Next.js.
 * @param props.children - Route segment content rendered inside the shell.
 * @returns The root HTML document with query state, navigation, and main content.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={styles.body}>
        <QueryProvider>
          <Navbar />
          <main className={styles.main}>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
