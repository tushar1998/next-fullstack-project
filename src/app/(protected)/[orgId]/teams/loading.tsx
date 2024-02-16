import React from "react";

import { Loader2 } from "lucide-react";

export default function loading() {
  return <Loader2 className="absolute left-1/2 top-1/2 animate-spin" />;
}
