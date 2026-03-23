export const authCookieName = "subsvault_session";

export function getAuthPassword() {
  return process.env.SUBSVAULT_APP_PASSWORD?.trim() || "";
}

export function getSessionSecret() {
  return process.env.SUBSVAULT_SESSION_SECRET?.trim() || "";
}

export function isAuthConfigured() {
  return Boolean(getAuthPassword() && getSessionSecret());
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}
