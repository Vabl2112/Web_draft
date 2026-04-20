"use client"

import type { ComponentProps } from "react"

type SvgProps = ComponentProps<"svg">

export function VkIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3.54 6.1c.1 5.1 2.69 10.2 8.24 10.2h.33V13.3c1.7.17 2.99 1.4 3.5 3h2.35v-.1c-.65-2.36-2.76-3.7-3.58-4.07.82-.5 2.67-2.03 2.95-5.03h-2.15c-.37 2.2-2.08 3.88-3.07 4.07V6.1h-2.04v8.85c-1-.2-2.82-2-3.2-4.85H3.54z" />
    </svg>
  )
}

export function BoostyIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7 3h6.8c3.1 0 5.2 2 5.2 4.9 0 2.1-1 3.6-2.7 4.3 2.2.7 3.7 2.5 3.7 4.9 0 3.1-2.4 5-6 5H7V3zm2.6 2.4v5.8h3.7c2 0 3.1-1 3.1-2.9 0-1.8-1.1-2.9-3.1-2.9H9.6zm0 8.2v6.0h4.3c2.3 0 3.6-1.1 3.6-3.0 0-1.9-1.3-3.0-3.6-3.0H9.6z" />
    </svg>
  )
}

export function MaxIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4 6h4l4 6 4-6h4v12h-3V11l-5 7-5-7v7H4V6z" />
    </svg>
  )
}

