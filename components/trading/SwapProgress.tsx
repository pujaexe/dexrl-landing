"use client";

import { ProgressShell, ProgressCard } from "./ProgressShell";
import WidgetPayment from "./WidgetPayment";

/** Onramp progress page (/swap/[tx]) */
export default function SwapProgress() {
  return (
    <ProgressShell>
      <ProgressCard>
        <WidgetPayment />
      </ProgressCard>
    </ProgressShell>
  );
}
