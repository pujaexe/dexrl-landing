"use client";

import { WidgetProviders } from "./WidgetProviders";
import WidgetTrading from "./WidgetTrading";
import WidgetAccount from "./WidgetAccount/WidgetAccount";
import WidgetTransactionHistory from "./WidgetTransactionHistory/WidgetTransactionHistory";
import WidgetReceivingAccountList from "./WidgetReceivingAccountList/WidgetReceivingAccountList";
import WidgetReceivingAccount from "./WidgetReceivingAccount/WidgetReceivingAccount";
import { useWidgetViewStore } from "@/store/widgetViewStore";

/**
 * Live onramp/offramp swap widget for the dexRL landing page.
 *
 * The swap form is always mounted so it anchors the card height; the other
 * panels (account, history, receiving) overlay it at exactly the same size, so
 * every view shares the swap card's height. Load via next/dynamic { ssr: false }.
 */
export function WidgetCard() {
  const view = useWidgetViewStore((s) => s.view);
  const isTrade = view === "trade";

  return (
    <div className="relative overflow-hidden bg-white rounded-[20px] border border-[#C2CFCB] shadow-[0_8px_32px_-8px_rgba(0,20,10,0.18)] w-full">
      {/* Swap form anchors the card height (kept mounted, hidden when a panel is open) */}
      <div className={isTrade ? "" : "invisible pointer-events-none"} aria-hidden={!isTrade}>
        <WidgetTrading />
      </div>

      {/* Panels fill the exact card height; each scrolls its own content */}
      {!isTrade && (
        <div className="absolute inset-0 flex flex-col overflow-hidden">
          {view === "account" && <WidgetAccount />}
          {view === "history" && <WidgetTransactionHistory />}
          {view === "receiving" && <WidgetReceivingAccountList />}
          {view === "receiving-add" && <WidgetReceivingAccount />}
        </div>
      )}
    </div>
  );
}

export default function SwapWidget() {
  return (
    <WidgetProviders>
      <WidgetCard />
    </WidgetProviders>
  );
}
