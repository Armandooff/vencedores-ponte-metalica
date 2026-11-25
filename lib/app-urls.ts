export const APP_MODE =
  process.env.NEXT_PUBLIC_APP_MODE === "admin" ? "admin" : "site";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://vencedores-ponte-metalica.vercel.app";

export const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, "") ||
  "https://vencedores-ponte-metalica-admin.vercel.app";

export const ADMIN_LOGIN_URL = `${ADMIN_URL}/admin/login`;

export const isAdminMode = APP_MODE === "admin";
