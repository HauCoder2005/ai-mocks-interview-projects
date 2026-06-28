const ACCESS_TOKEN_KEY = "ai_mock_interview_access_token";
const REFRESH_TOKEN_KEY = "ai_mock_interview_refresh_token";

export const tokenStorage = {
  getAccessToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  removeAccessToken() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  clearAccessToken() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  removeRefreshToken() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  clearAuthTokens() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
