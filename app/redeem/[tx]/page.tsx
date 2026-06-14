"use client";

import dynamic from "next/dynamic";

const RedeemProgress = dynamic(() => import("@/components/trading/RedeemProgress"), { ssr: false });

export default function RedeemTxPage() {
  return <RedeemProgress />;
}
