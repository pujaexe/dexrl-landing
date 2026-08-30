"use client";

import {
    loginWithGoogleBackend,
    loginWithMetamaskBackend
} from "@/services/authService";
import { POLYGON_CHAIN_ID } from "@/services/swcService";
import { getSWCAddress, getEOAAddress } from "@/services/addressService";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useGoogleLogin } from "@react-oauth/google";
import { BrowserProvider } from "ethers";
import { useState } from "react";

export const useLoginUserTrading = ({ onClose }: { onClose?: () => void }) => {
    const { setAuthFromBackend } = useTradingAuthStore();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isMetamaskLoading, setIsMetamaskLoading] = useState(false);
    const [errorMetamask, setErrorMetamask] = useState<string | null>(null);

    const handleGoogleLogin = useGoogleLogin({
        flow: "auth-code",
        scope: "email profile",
        onSuccess: async (codeResponse) => {
            setIsGoogleLoading(true);
            try {
                const result = await loginWithGoogleBackend(
                    codeResponse.code,
                    window.location.origin
                );

                if (!result.success) {
                    alert("Login gagal: " + result.message);
                    return;
                }

                // Get Smart Account address from database (created by backend on login)
                const swcAddress = await getSWCAddress(result.data.user.id);
                const eoaAddress = await getEOAAddress(result.data.user.id);

                setAuthFromBackend({
                    jwt: result.data.jwt,
                    user: result.data.user,
                    wallet: {
                        smartAccount: null, // Not needed in frontend anymore
                        isConnected: true,
                        chainId: POLYGON_CHAIN_ID,
                        address: swcAddress?.address || null,
                        swcAddress: swcAddress?.address || null,
                        addressRecord: swcAddress,
                        eoaAddress: eoaAddress?.address || null,
                        eoaRecord: eoaAddress,
                        eoaAccount: null, // Not needed in frontend anymore
                    },
                    provider: 'google'
                });

                onClose?.();
            } catch (err) {
                console.error("Login error:", err);
                alert("Login gagal: " + (err as Error).message);
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: (err) => console.error("Google login error:", err),
    });

    const handleMetamaskLogin = async () => {
        if (typeof window.ethereum === "undefined") {
            setErrorMetamask("No extension of Metamask detected, please install or create account first");
            return;
        }
        setIsMetamaskLoading(true);

        try {
            const accounts: string[] = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length === 0) {
                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                } catch (error: any) {
                    if (error.code === -32002) {
                        throw new Error(
                            "MetaMask request pending. Please check and approve."
                        );
                    } else if (error.code === 4001) {
                        throw new Error("User rejected connection.");
                    } else {
                        throw new Error(`MetaMask connection failed: ${error.message}`);
                    }
                }
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const result = await loginWithMetamaskBackend(address);

            if (!result.success) {
                setErrorMetamask(result.message);
                return;
            }

            // Get Smart Account address from database (created by backend on login)
            const swcAddress = await getSWCAddress(result.data.user.id);
            const eoaAddress = await getEOAAddress(result.data.user.id);

            setAuthFromBackend({
                jwt: result.data.jwt,
                user: result.data.user,
                wallet: {
                    smartAccount: null, // Not needed in frontend anymore
                    isConnected: true,
                    chainId: POLYGON_CHAIN_ID,
                    address: swcAddress?.address || null,
                    swcAddress: swcAddress?.address || null,
                    addressRecord: swcAddress,
                    eoaAddress: eoaAddress?.address || null,
                    eoaRecord: eoaAddress,
                    eoaAccount: null, // Not needed in frontend anymore
                },
                provider: 'metamask'
            });

            onClose?.();
        } catch (error) {
            console.error("MetaMask login gagal:", error);
            setErrorMetamask((error as Error).message);
        } finally {
            setIsMetamaskLoading(false);
        }
    };

    return {
        handleGoogleLogin,
        handleMetamaskLogin,
        isGoogleLoading,
        isMetamaskLoading,
        errorMetamask,
    }
};