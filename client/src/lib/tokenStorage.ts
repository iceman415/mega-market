/**
 * Local token fallback.
 *
 * The primary mechanism remains the httpOnly cookie set by the server on
 * login — the browser attaches it automatically via `withCredentials: true`,
 * and JS can never read it.
 *
 * Some browsers (Safari/iOS with ITP, content blockers, private mode…) block
 * cross-site cookies, so the cookie never reaches the server and the user is
 * logged out right after signing in. For those devices the token returned in
 * the login response body is mirrored here and sent as an
 * `Authorization: Bearer` header instead. Devices with working cookies are
 * unaffected: the server accepts either source.
 *
 * Everything in this file is wrapped in try/catch so private browsing modes
 * that deny storage access degrade gracefully (cookies keep working).
 */

const STORAGE_KEY = "admin.auth.token";

const isBrowser = typeof window !== "undefined";

export function saveToken(token: string): void {
  if (!isBrowser || !token) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Storage unavailable — cookies remain the only mechanism.
  }
}

export function getStoredToken(): string | null {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearToken(): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — nothing to clean up if storage is unavailable.
  }
}
