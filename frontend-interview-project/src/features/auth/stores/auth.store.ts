"use client";

import { useSyncExternalStore } from "react";

import type { AuthUser } from "@/features/auth/types";

type AuthState = {
  user: AuthUser | null;
};

const emptyAuthState: AuthState = {
  user: null,
};

let authState: AuthState = emptyAuthState;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function getSnapshot() {
  return authState;
}

function getServerSnapshot() {
  return emptyAuthState;
}

export const authStore = {
  useAuthState() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  },
  setUser(user?: AuthUser | null) {
    authState = { user: user ?? null };
    emitChange();
  },
  clearSession() {
    authState = emptyAuthState;
    emitChange();
  },
  hydrateFromStorage() {
    return;
  },
};
