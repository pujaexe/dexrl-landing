"use client";

import links from "@/assets/links.json";
import ButtonConnect from "@/components/ButtonConnect";
import { useLoginUserTrading } from "@/components/trading/hooks/useLoginUserTrading";
import { ONRAMP_GOOGLE_ACTIVE, ONRAMP_METAMASK_ACTIVE } from "@/lib/constant";
import clsx from "clsx";
import React from "react";

interface ModalConnectProps {
  open: boolean;
  onClose: () => void;
}

const ModalConnect: React.FC<ModalConnectProps> = ({ open, onClose }) => {
  const {
    handleGoogleLogin,
    handleMetamaskLogin,
    isGoogleLoading,
    isMetamaskLoading,
    errorMetamask,
  } = useLoginUserTrading({ onClose });

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-40 transition-colors bg-[#002116]/70"
          onClick={onClose}
        />
      )}

      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 rounded-t-xl shadow-lg transform transition-transform duration-300 z-50",
          "bg-white text-[#003E2C]",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ minHeight: "40%", maxHeight: "90%", overflowY: "auto" }}
      >
        <div className="flex justify-center py-3 sticky top-0 bg-white z-10">
          <div className="w-12 h-1.5 rounded-full bg-[#ECF0EF]" />
        </div>

        <div className="px-4 flex flex-col gap-4">
          <div className="text-xl font-semibold text-[#003E2C] text-center mb-1">
            Welcome back
          </div>
          
          <div className="text-[12px] font-semibold text-[#6A9080] uppercase tracking-[0.08em] mb-1">
            Sign In
          </div>

          <ButtonConnect
            isMaintenance={!ONRAMP_GOOGLE_ACTIVE}
            isLoading={isGoogleLoading}
            onClick={handleGoogleLogin}
            icon="flat-color-icons:google"
            title="Continue with Google"
            isCenter
          />

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#D8E3DF]"></div>
            <span className="text-[13px] font-medium text-[#6A9080]">or connect a wallet</span>
            <div className="flex-1 h-px bg-[#D8E3DF]"></div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <ButtonConnect
                isMaintenance={!ONRAMP_METAMASK_ACTIVE}
                isLoading={isMetamaskLoading}
                onClick={handleMetamaskLogin}
                icon="https://cdn.jsdelivr.net/gh/GMWalletApp/crypto-icons@latest/assets/wallets/branded/metamask.svg"
                title="MetaMask"
                rightElement={
                  <span className="text-[10px] font-bold tracking-[0.05em] px-2 py-[3px] rounded-full text-[#4285F4] bg-[rgba(66,133,244,0.1)] uppercase ml-auto">DETECTED</span>
                }
              />
              {errorMetamask && (
                <div className="text-red-500 text-xs mt-1">{errorMetamask}</div>
              )}
            </div>

            {/* Additional Wallet Providers (Placeholders) */}
            <ButtonConnect
              icon="https://cdn.jsdelivr.net/gh/GMWalletApp/crypto-icons@latest/assets/wallets/branded/walletconnect.svg"
              title="WalletConnect"
              onClick={() => alert("WalletConnect integration coming soon!")}
            />
            
            <ButtonConnect
              icon="https://cdn.jsdelivr.net/gh/GMWalletApp/crypto-icons@latest/assets/wallets/branded/phantom.svg"
              title="Phantom"
              onClick={() => alert("Phantom integration coming soon!")}
              rightElement={
                <span className="text-[10px] font-bold tracking-[0.05em] px-2 py-[3px] rounded-full text-[#26a17b] bg-[rgba(38,161,123,0.1)] uppercase ml-auto">RECENT</span>
              }
            />
          </div>
        </div>

        <hr className="my-6 border-[#C2CFCB]" />

        {/* Footer Links */}
        <div className="px-4 pb-6">
          <div className="flex flex-col gap-2 text-xs transition-colors text-[#6A9080] items-center">
            <span className="text-center">
              By connecting your wallet, you agree to our
            </span>
            <div className="flex gap-3">
              <a
                href={links.terms_of_service}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="text-left font-medium underline cursor-pointer hover:text-[#003E2C]">
                  Terms of Service
                </button>
              </a>
              <span>&</span>
              <a
                href={links.privacy_policy}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="text-left font-medium underline cursor-pointer hover:text-[#003E2C]">
                  Privacy Policy
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConnect;
