/**
 * When unset/false, admin routes open without Supabase login (frontend demo).
 * Set `VITE_ADMIN_AUTH=true` in `.env` to require real admin sign-in.
 */
export const isAdminAuthRequired = () => import.meta.env.VITE_ADMIN_AUTH === "true";
