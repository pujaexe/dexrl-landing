"use client";

import type { ReactNode } from "react";
import { WidgetProviders } from "./WidgetProviders";
import { useHouseConfig } from "./useHouseConfig";

/**
 * Two-column shell for the /swap and /redeem pages.
 * Left: the global "house" My Page wording (title + content, configurable from
 * the affiliate dashboard). Right: the widget (trade form or tx progress).
 * Page scroll-lock + dark background are handled by the segment layout
 * (TradePageChrome) so they persist across /swap <-> /swap/[tx] navigation.
 */
function HouseLayout({ children }: { children: ReactNode }) {
  const { data: house } = useHouseConfig();
  const background = house?.background;
  const title = house?.title || "dexRL Dex Trading";
  const inkColor = house?.color || "#ECF0EF";

  return (
    <main
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: background
          ? `center / cover no-repeat url(${background})`
          : "radial-gradient(ellipse 80% 70% at 0% 0%, rgba(0,88,64,0.55), transparent 60%), radial-gradient(ellipse 70% 70% at 100% 100%, rgba(0,33,22,0.85), transparent 65%), #001B0E",
      }}
    >
      <div
        style={{ width: "100%", maxWidth: 1180, maxHeight: "100%" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        {/* Left: house wording */}
        <div style={{ color: inkColor }} className="order-2 md:order-1">
          <h1
            style={{ fontFamily: "var(--serif)", color: inkColor }}
            className="text-[clamp(34px,5vw,56px)] leading-tight font-normal mb-6"
          >
            {title}
          </h1>
          {house?.content ? (
            <div
              className="house-content text-[15px] leading-relaxed opacity-90 space-y-3"
              style={{ color: inkColor }}
              dangerouslySetInnerHTML={{ __html: house.content }}
            />
          ) : (
            <p className="text-[15px] leading-relaxed opacity-80 max-w-md">
              Move money across borders in minutes. Connect, choose your asset, set the
              destination, and confirm — our smart router handles the rest.
            </p>
          )}
        </div>

        {/* Right: the widget — capped to the viewport, scrolls internally */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end w-full min-h-0">
          <div className="w-full max-w-[460px] max-h-[calc(100dvh-48px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export function ProgressShell({ children }: { children: ReactNode }) {
  return (
    <WidgetProviders>
      <HouseLayout>{children}</HouseLayout>
    </WidgetProviders>
  );
}

/** White card wrapper for the progress widgets (which have no card of their own). */
export function ProgressCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-[20px] border border-[#C2CFCB] shadow-[0_8px_32px_-8px_rgba(0,20,10,0.25)] w-full">
      {children}
    </div>
  );
}
