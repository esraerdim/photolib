export const ADMIN_EMAIL = 'esra.erdim@tasarlab.com'

export function isAdminEmail(email) {
  return String(email ?? '').trim().toLowerCase() === ADMIN_EMAIL
}
