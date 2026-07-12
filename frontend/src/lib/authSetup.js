import axios from "axios";

// Cross-origin cookies are unreliable on some mobile browsers, so we also send
// the JWT via Authorization header. This module wires that up globally for both
// axios and fetch, but ONLY for requests to our own backend — never leaks the
// token to third-party origins (Google OAuth, etc.).

const TOKEN_KEY = "auth_token";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const isBackendUrl = (url) => {
  if (!url) return false;
  const s = typeof url === "string" ? url : url.toString();
  return s.startsWith(BACKEND_URL);
};

// Guard against duplicate registration on HMR / re-imports
if (!globalThis.__syncAuthSetupDone) {
  globalThis.__syncAuthSetupDone = true;

  axios.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token && isBackendUrl(config.url)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url;
    if (isBackendUrl(url)) {
      const token = getAuthToken();
      if (token) {
        init.headers = {
          ...(init.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return originalFetch(input, init);
  };
}
