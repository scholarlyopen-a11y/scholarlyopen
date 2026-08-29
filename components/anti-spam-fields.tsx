"use client"

import { useEffect, useState } from "react"

interface AntiSpamFieldsProps {
  /** Optional custom honeypot field name */
  honeypotName?: string
}

export function AntiSpamFields({ honeypotName = "website_hp" }: AntiSpamFieldsProps) {
  const [mountedTime, setMountedTime] = useState<number | null>(null)

  useEffect(() => {
    // Record the exact client render time
    setMountedTime(Date.now())
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Honeypot field: real users won't see or fill this; bots will fill it automatically */}
      <input
        type="text"
        name={honeypotName}
        id={honeypotName}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />

      {/* Timestamp field: tracks the time when the form was rendered in the browser */}
      <input
        type="hidden"
        name="_form_ts"
        id="_form_ts"
        value={mountedTime ?? ""}
      />
    </div>
  )
}
