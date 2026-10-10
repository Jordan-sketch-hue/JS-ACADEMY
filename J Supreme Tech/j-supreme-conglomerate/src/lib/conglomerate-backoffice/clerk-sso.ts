/** Primary Clerk app (this conglomerate OS). Satellites redirect sign-in here. */
export function getConglomeratePrimaryUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONGLOMERATE_PRIMARY_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://jsupremeconglomerate.online";
}

/** Sign-in on the primary app, then return to the satellite back office. */
export function buildClerkSatelliteHandoffUrl(targetBackofficeUrl: string): string {
  const primary = getConglomeratePrimaryUrl();
  const signIn = new URL("/sign-in", primary);
  signIn.searchParams.set("redirect_url", targetBackofficeUrl);
  return signIn.toString();
}

export function resolvePanelHref(href: string, origin?: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  const base = (origin ?? getConglomeratePrimaryUrl()).replace(/\/$/, "");
  return `${base}${href.startsWith("/") ? href : `/${href}`}`;
}
