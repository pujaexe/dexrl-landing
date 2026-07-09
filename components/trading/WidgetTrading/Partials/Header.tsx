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
                        <Iconify name="logos:metamask-icon" className="text-xl" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
