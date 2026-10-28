export const AUTH_RETURN_PATH_KEY = "brand-hub:auth-return-path";

/** Validate at both ends of OAuth, including values changed in browser storage. */
export function safeReturnPath(value: unknown, origin: string): string {
  if (typeof value !== "string") return "/";
  try {
    const decoded = decodeURIComponent(value);
    for (const path of [value, decoded]) {
      const hasControlCharacter = [...path].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
      if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || hasControlCharacter) return "/";
      const parsed = new URL(path, origin);
      if (parsed.origin !== origin || parsed.pathname.startsWith("//")) return "/";
    }
    const url = new URL(value, origin);
    if (url.origin !== origin || url.pathname.startsWith("//")) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function saveReturnPath(): string {
  const path = safeReturnPath(`${location.pathname}${location.search}${location.hash}`, location.origin);
  try {
    sessionStorage.setItem(AUTH_RETURN_PATH_KEY, path);
  } catch {
    // OAuth returns to the origin. If storage is denied, the deep link cannot be restored.
  }
  return path;
}

export function consumeReturnPath(): string | null {
  try {
    const stored = sessionStorage.getItem(AUTH_RETURN_PATH_KEY);
    sessionStorage.removeItem(AUTH_RETURN_PATH_KEY);
    return stored === null ? null : safeReturnPath(stored, location.origin);
  } catch {
    return null;
  }
}
