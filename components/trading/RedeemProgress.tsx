"use client";

import { ProgressShell, ProgressCard } from "./ProgressShell";
import WidgetOfframp from "./WidgetOfframp";

/** Offramp progress page (/redeem/[tx]) */
export default function RedeemProgress() {
  return (
    <ProgressShell>
      <ProgressCard>
        <WidgetOfframp />
      </ProgressCard>
    </ProgressShell>
  );
}
