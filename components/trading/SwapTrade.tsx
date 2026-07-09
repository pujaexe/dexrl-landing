"use client";

import { ProgressShell } from "./ProgressShell";
import { WidgetCard } from "./SwapWidget";

/** Standalone trading page (/swap) — swap form + in-widget panels in the two-column shell */
export default function SwapTrade() {
  return (
    <ProgressShell>
      <WidgetCard />
    </ProgressShell>
  );
}
