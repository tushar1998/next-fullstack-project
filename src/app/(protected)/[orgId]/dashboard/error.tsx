"use client"

import React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="space-y-2 text-center">
      <p>Dashboard Error: {error?.message || "Something went wrong"}</p>
      <div className="space-x-2">
        <Button variant="outline" onClick={() => router.push("/")}>
          Go to Home
        </Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
