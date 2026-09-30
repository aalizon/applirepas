import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Protection simple par mot de passe familial (variable APP_PASSWORD).
 * Sans APP_PASSWORD (développement local), l'application est ouverte.
 */
export const SESSION_COOKIE = "applirepas_session";

export function authEnabled() {
  return !!process.env.APP_PASSWORD;
}

export function sessionToken() {
  const secret = process.env.SESSION_SECRET ?? "applirepas";
  return createHmac("sha256", secret).update(process.env.APP_PASSWORD ?? "").digest("hex");
}

export function isValidSession(token: string | undefined) {
  if (!authEnabled()) return true;
  if (!token) return false;
  const expected = Buffer.from(sessionToken());
  const got = Buffer.from(token);
  return expected.length === got.length && timingSafeEqual(expected, got);
}

export function checkPassword(password: string) {
  const expected = Buffer.from(process.env.APP_PASSWORD ?? "");
  const got = Buffer.from(password);
  return authEnabled() && expected.length === got.length && timingSafeEqual(expected, got);
}
