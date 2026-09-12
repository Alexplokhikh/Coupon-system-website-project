const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();

export const API_BASE_URL = (
  configuredApiUrl || "http://localhost:8080"
).replace(/\/+$/, "");
