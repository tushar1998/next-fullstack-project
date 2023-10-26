"use client"

import React from "react"

export default function ServerErrorBoundary({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return <div>{JSON.stringify(error)}</div>
}
