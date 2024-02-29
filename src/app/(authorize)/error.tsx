"use client";

import React from "react";

export default function ServerErrorBoundary({
  error,
}: Readonly<{
  error: Error & { digest?: string };
}>) {
  return <div>{JSON.stringify(error)}</div>;
}
