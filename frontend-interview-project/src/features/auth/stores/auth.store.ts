"use client";

import { useSyncExternalStore } from "react";

import { tokenStorage } from "@/lib/auth/token-storage";
import type { User } from "@/types/user";

type AuthState = {
  accessToken: string | null;
  user: User | null;
};

const emptyAuthState: AuthState = {
  accessToken: null,
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
  setSession(accessToken: string, user: User) {
    tokenStorage.setAccessToken(accessToken);
    authState = { accessToken, user };
    emitChange();
  },
  clearSession() {
    tokenStorage.clearAccessToken();
    authState = emptyAuthState;
    emitChange();
  },
  hydrateFromStorage() {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken && authState.accessToken !== accessToken) {
      authState = { ...authState, accessToken };
      emitChange();
    }
  },
};
