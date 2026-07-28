"use client";

import { Iconify } from "@/components/icon/Iconify";
import { textWithCenterEllipsis } from "@/helper/string";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import clsx from "clsx";
import { useNavigate, useParams } from "@/lib/router-compat";

const Header = () => {
    const { loginSession, isConnected } = useTradingAuthStore();
    const navigate = useNavigate();
    const { username = "dexrl" } = useParams();

    return (
        <header className="flex items-center justify-between bg-transparent">
            <h1 className="text-[#003E2C] text-[30px] leading-none" style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Swap</h1>

            <div className="flex items-center gap-2.5">
                <p className="text-[#2D5C47] text-sm font-normal truncate max-w-[200px]">
                    {loginSession?.user?.email ||
                        textWithCenterEllipsis(loginSession?.address || "", 15, 5)}
                </p>
                <button
                    type="button"
                    className={clsx(
                        "h-11 w-11 !rounded-[12px] min-w-11 flex items-center justify-center transition-colors",
                        "bg-[#ECF0EF] hover:bg-[#D8E3DF] text-[#003E2C] cursor-pointer"
                    )}
                    id="account-button"
                    onClick={() => navigate(`/${username}/account`)}
                >
                    {!isConnected && (
                        <Iconify
                            name="mdi:account-outline"
                            className="text-xl text-[#003E2C]"
                        />
                    )}
                    {isConnected && loginSession?.provider === "google" && (
                        <Iconify name="flat-color-icons:google" className="text-2xl" />
                    )}
                    {isConnected && loginSession?.provider === "metamask" && (
                        <div className="relative w-full h-full rounded-[12px]">
                            <div 
                                className="w-full h-full rounded-[12px] flex items-center justify-center text-white font-mono font-bold shadow-sm text-sm"
                                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                            >
                                {loginSession?.address?.substring(2, 4).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-[20px] h-[20px] rounded-full bg-white border border-[#D8E3DF] flex items-center justify-center overflow-hidden shadow-sm">
                                <img 
                                    src="https://cdn.jsdelivr.net/gh/GMWalletApp/crypto-icons@latest/assets/wallets/branded/metamask.svg" 
                                    className="w-[14px] h-[14px] rounded-[3px]"
                                    alt="MetaMask"
                                />
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
