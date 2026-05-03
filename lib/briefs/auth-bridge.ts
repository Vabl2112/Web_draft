/**
 * Связка строкового id из auth-context с числовым clientId в мок-брифах.
 */

export function authUserIdToBriefClientId(authId: string): number {
  const n = Number(authId)
  if (Number.isFinite(n) && !Number.isNaN(n)) return n
  let h = 0
  for (let i = 0; i < authId.length; i++) {
    h = (h * 31 + authId.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 9_000_000 + 1_000_000
}
