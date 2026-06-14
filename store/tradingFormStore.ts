import type { TokenInterface } from "@/data";
import { defaultFromToken, defaultToToken } from "@/lib/constant";
import { create } from "zustand";

interface TradingFormState {
  fromToken: TokenInterface | null;
  toToken: TokenInterface | null;
  formActive: "onramp" | "offramp";
  swapTokens: () => void;
  resetTokens: () => void;
  getSelectedToken: () => TokenInterface | null;
  setSelectedToken: (token: TokenInterface | null) => void;
  setFromToken: (token: TokenInterface | null) => void;
  setToToken: (token: TokenInterface | null) => void;
  isOpenModalSuccess: boolean;
  onOpenModalSuccess: () => void;
  onCloseModalSuccess: () => void;
}

export const useTradingFormStore = create<TradingFormState>((set, get) => ({
  fromToken: defaultFromToken,
  toToken: defaultToToken,
  formActive: "onramp",
  isOpenModalSuccess: false,

  onOpenModalSuccess: () => set({ isOpenModalSuccess: true }),
  onCloseModalSuccess: () => set({ isOpenModalSuccess: false }),

  swapTokens: () =>
    set((state) => ({
      fromToken: state.toToken,
      toToken: state.fromToken,
      formActive: state.formActive === "onramp" ? "offramp" : "onramp",
    })),

  resetTokens: () =>
    set(() => ({
      fromToken: defaultFromToken,
      toToken: defaultToToken,
    })),

  getSelectedToken: () => {
    const state = get();
    return state.formActive === "onramp" ? state.toToken : state.fromToken;
  },

  setSelectedToken: (token: TokenInterface | null) =>
    set((state) => {
      if (state.formActive === "onramp") {
        return {
          toToken: token,
        };
      } else {
        return {
          fromToken: token,
        };
      }
    }),

  setFromToken: (token: TokenInterface | null) => set({ fromToken: token }),
  setToToken: (token: TokenInterface | null) => set({ toToken: token }),
}));
