"use client"

import { useCallback, useRef } from "react"

const BLOCK_MS = 280

/**
 * После закрытия Radix Dropdown / Dialog клик «снаружи» иногда доходит до карточки под оверлеем.
 * Кратко блокируем переход по карточке.
 */
export function useSuppressNavAfterDropdownClose() {
  const blockNavUntilRef = useRef(0)

  const scheduleBlockCardNav = useCallback(() => {
    blockNavUntilRef.current = Date.now() + BLOCK_MS
  }, [])

  const onDropdownOpenChange = useCallback(
    (open: boolean) => {
      if (!open) scheduleBlockCardNav()
    },
    [scheduleBlockCardNav],
  )

  const allowCardNavigation = useCallback(() => Date.now() >= blockNavUntilRef.current, [])

  return { onDropdownOpenChange, allowCardNavigation, scheduleBlockCardNav }
}
