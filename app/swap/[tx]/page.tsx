"use client";

import dynamic from "next/dynamic";

const SwapProgress = dynamic(() => import("@/components/trading/SwapProgress"), { ssr: false });

export default function SwapTxPage() {
  return <SwapProgress />;
}
