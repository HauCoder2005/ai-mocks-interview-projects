"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

type QueryProviderProps = {
  children: React.ReactNode;
};

/**
 * Provides a stable TanStack Query client for all client-side descendants.
 *
 * @param props - Component props containing the subtree that needs query access.
 * @param props.children - React nodes rendered inside the query provider.
 * @returns A React provider wrapping the supplied children with QueryClient state.
 */
export default function QueryProvider({ children }: QueryProviderProps) {
  // useState prevents a new QueryClient from being created on every render.
  const [queryClient] = useState<QueryClient>(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
