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
        style={{ minHeight: "40%" }}
      >
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 rounded-full bg-[#ECF0EF]" />
        </div>

        <div className="px-4 flex flex-col gap-3">
          <div className="text-sm font-semibold text-[#2D5C47]">
            Connect Account
          </div>

          <ButtonConnect
            isMaintenance={!ONRAMP_GOOGLE_ACTIVE}
            isLoading={isGoogleLoading}
            onClick={handleGoogleLogin}
            icon="flat-color-icons:google"
            title="Continue with Google"
          />

          <div>
            <ButtonConnect
              isMaintenance={!ONRAMP_METAMASK_ACTIVE}
              isLoading={isMetamaskLoading}
              onClick={handleMetamaskLogin}
              icon="logos:metamask-icon"
              title="Continue with Metamask"
            />
            {errorMetamask && (
              <div className="text-red-500 text-xs mt-1">{errorMetamask}</div>
            )}
          </div>
        </div>

        <hr className="my-4 border-[#C2CFCB]" />

        {/* Footer Links */}
        <div className="">
          <div className="flex flex-col px-4 pb-4 gap-3 text-xs transition-colors text-[#6A9080]">
            <a
              href={links.terms_of_service}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="text-left hover:underline cursor-pointer hover:text-[#003E2C]">
                Terms & Conditions
              </button>
            </a>
            <a
              href={links.privacy_policy}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="text-left hover:underline cursor-pointer hover:text-[#003E2C]">
                Privacy Policy
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConnect;
