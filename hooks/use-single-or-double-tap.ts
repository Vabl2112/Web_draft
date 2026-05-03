"use client"

import { useCallback, useEffect, useRef } from "react"

const GAP_MS = 300

/**
 * Один тап — отложенный onSingle (чтобы успеть поймать второй как «двойной»).
 * Два тапа по тому же ключу подряд — onDouble, модалка не открывается.
 */
export function useSingleOrDoubleTap<T>(onSingle: (p: T) => void, onDouble: (p: T) => void, keyOf: (p: T) => string) {
  const lastRef = useRef<{ key: string; t: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return useCallback(
    (payload: T) => {
      const key = keyOf(payload)
      const now = Date.now()
      const last = lastRef.current

      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      if (last && last.key === key && now - last.t < GAP_MS) {
        lastRef.current = null
        onDouble(payload)
        return
      }

      lastRef.current = { key, t: now }
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        lastRef.current = null
        onSingle(payload)
      }, GAP_MS)
    },
    [onSingle, onDouble, keyOf],
  )
}
