"use client";

import {
  useMutation,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { login } from "../api/auth.api";
import type {
  LoginRequest,
  LoginResponse,
  UseLoginMutationOptions,
} from "../types/auth.types";
import { persistAccessToken, resolveAccessToken } from "../utils/auth-token.util";

/**
 * Defines the default route used after a successful authentication flow.
 *
 * @param value - Static route path used when no hook override is provided.
 * @returns The default post-login redirect path.
 */
const DEFAULT_LOGIN_REDIRECT_PATH = "/dashboard";

/**
 * Executes the login mutation and applies authenticated UI side effects.
 *
 * @param options - Optional hook behavior overrides.
 * @param options.redirectTo - Route path used after successful authentication.
 * @returns A TanStack Query mutation result for the login operation.
 */
export const useLoginMutation = (
  options: UseLoginMutationOptions = {},
): UseMutationResult<LoginResponse, Error, LoginRequest> => {
  const router = useRouter();
  const redirectTo = options.redirectTo ?? DEFAULT_LOGIN_REDIRECT_PATH;

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (response) => {
      const token = resolveAccessToken(response);

      persistAccessToken(token);
      router.push(redirectTo);
    },
  });
};
