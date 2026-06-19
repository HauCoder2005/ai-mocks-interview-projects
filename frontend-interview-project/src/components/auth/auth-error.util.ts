import { AxiosError } from "axios";

type BackendErrorResponse = {
  message?: string | string[];
};

/**
 * Resolves a user-facing authentication error message from an unknown error.
 *
 * @param error - Unknown error thrown by the authentication mutation.
 * @param fallbackMessage - Message returned when the backend does not provide one.
 * @returns A Vietnamese error message suitable for form-level feedback.
 */
export const getAuthErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as BackendErrorResponse | undefined;
    const message = responseData?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (message) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
