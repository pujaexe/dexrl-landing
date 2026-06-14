import { TradePageChrome } from "@/components/trading/TradePageChrome";

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return <TradePageChrome>{children}</TradePageChrome>;
}
