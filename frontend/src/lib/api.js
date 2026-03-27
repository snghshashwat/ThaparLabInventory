import axios from "axios";

function resolveApiBaseUrl() {
  const configuredBase = import.meta.env.VITE_API_URL;

  if (!configuredBase) {
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.hostname}:5050/api`;
    }
    return "http://localhost:5050/api";
  }

  // In local dev, keep frontend and backend on the same host (localhost or LAN IP)
  // so auth cookies are treated as same-site and persist correctly.
  if (import.meta.env.DEV && typeof window !== "undefined") {
    try {
      const parsed = new URL(configuredBase);
      parsed.hostname = window.location.hostname;
      return parsed.toString().replace(/\/$/, "");
    } catch {
      return configuredBase;
    }
  }

  return configuredBase;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  timeout: 10000,
});

export default api;
