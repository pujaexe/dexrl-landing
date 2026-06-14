import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SaveLoginSession, TradingUser, WalletState } from "@/data/interface";

interface TradingAuthState {
    loginSession: SaveLoginSession | null;
    isConnected: boolean;
    jwtToken: string | null;
    setLoginSession: (session: SaveLoginSession) => void;
    clearLoginSession: () => void;
    wallet?: WalletState | null;
    currentUser?: TradingUser | null;
    setWallet: (wallet: WalletState) => void;
    setCurrentUser: (currentUser: TradingUser | null) => void;
    setJwtToken: (token: string) => void;
    clearJwtToken: () => void;
    setAuthFromBackend: (data: {
        jwt: string;
        user: any;
        wallet: any;
        provider: 'google' | 'metamask';
    }) => void;
}

export const useTradingAuthStore = create<TradingAuthState>()(
    persist(
        (set) => ({
            loginSession: null,
            isConnected: false,
            wallet: null,
            currentUser: null,
            jwtToken: null,

            setLoginSession: (session: SaveLoginSession) =>
                set({
                    loginSession: session,
                    isConnected: true,
                }),

            clearLoginSession: () =>
                set({
                    loginSession: null,
                    isConnected: false,
                    wallet: null,
                    currentUser: null,
                    jwtToken: null,
                }),

            setWallet: (wallet: WalletState) =>
                set({
                    wallet: wallet,
                }),

            setCurrentUser: (currentUser: TradingUser | null) =>
                set({
                    currentUser: currentUser,
                }),

            setJwtToken: (token: string) =>
                set({ jwtToken: token }),

            clearJwtToken: () =>
                set({ jwtToken: null }),

            setAuthFromBackend: (data) => {
                const { jwt, user, wallet, provider } = data;

                const loginSession: SaveLoginSession = provider === 'google'
                    ? {
                        provider: 'google',
                        user: {
                            name: user.fullname,
                            email: user.email,
                            avatar_url: user.avatar_url,
                            userId: user.id,
                        }
                    }
                    : {
                        provider: 'metamask',
                        address: wallet.eoaAddress || wallet.address // Use EOA address (Metamask wallet) for display
                    };

                const walletState: WalletState = {
                    isConnected: true,
                    address: wallet.address,
                    swcAddress: wallet.swcAddress,
                    chainId: wallet.chainId,
                    smartAccount: wallet.smartAccount,
                    addressRecord: wallet.addressRecord,
                    eoaAddress: wallet.eoaAddress ?? null,
                    eoaRecord: wallet.eoaRecord ?? null,
                    eoaAccount: wallet.eoaAccount ?? null,
                };

                set({
                    loginSession,
                    isConnected: true,
                    wallet: walletState,
                    currentUser: user,
                    jwtToken: jwt,
                });
            },
        }),
        {
            name: "trading-auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
