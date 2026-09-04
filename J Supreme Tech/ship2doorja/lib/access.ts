// =====================================================================
// Capability-URL access control (demo gating — no public login form).
// Visiting /enter-<area>/<key> sets an httpOnly cookie via middleware,
// then redirects to the clean area URL. Without the cookie (or the key
// in the link), the area is bounced home so it isn't discoverable.
//
// For a real multi-user system, swap this for Clerk/Supabase auth.
// Keys can be overridden with env vars in Vercel; defaults are baked in
// so the demo works out of the box.
// =====================================================================

export const ACCESS = {
  admin: {
    home: "/back-office",
    cookie: "s2d_bo",
    key: process.env.S2D_ADMIN_KEY ?? "3l9iwqYU8CoLtWVnVPjqKkoNSSMcskN7qH0tcCz5",
  },
  portal: {
    home: "/portal",
    cookie: "s2d_portal",
    key: process.env.S2D_PORTAL_KEY ?? "8xbeEBvTxpKVidNBAQYFfJwFg5UmItd9y15bCCqh",
  },
} as const;

export type AccessArea = (typeof ACCESS)[keyof typeof ACCESS];
