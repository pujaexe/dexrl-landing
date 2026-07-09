import { create } from "zustand";

/**
 * In-widget panel navigation for the landing swap widget. The ported widget was
 * route-based (account / history / receiving-account were separate pages); on the
 * landing these are panels swapped via state inside the same card — no path change.
 */
export type WidgetView = "trade" | "account" | "history" | "receiving" | "receiving-add";

interface WidgetViewState {
  view: WidgetView;
  stack: WidgetView[];
  push: (v: WidgetView) => void;
  back: () => void;
  reset: () => void;
}

export const useWidgetViewStore = create<WidgetViewState>((set) => ({
  view: "trade",
  stack: [],
  push: (v) => set((s) => ({ stack: [...s.stack, s.view], view: v })),
  back: () =>
    set((s) => {
      const stack = [...s.stack];
      const prev = stack.pop() ?? "trade";
      return { view: prev, stack };
    }),
  reset: () => set({ view: "trade", stack: [] }),
}));
