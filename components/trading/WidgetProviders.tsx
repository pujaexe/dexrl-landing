"use client";

import { useState, type ReactNode } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import web3AuthContextConfig from "@/context/web3authContext";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import { Toaster } from "@/components/ui/toast";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/**
 * Self-contained provider stack for the trading widget. Mounted only around the
 * widget subtree (landing hero + /swap + /redeem) so the rest of the marketing
 * site stays a lean static server bundle. Always rendered client-side
 * (the consumer loads this via next/dynamic { ssr: false }).
 */
export function WidgetProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
              <ModalProvider>{children}</ModalProvider>
            </AuthProvider>
            <Toaster />
          </GoogleOAuthProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}
