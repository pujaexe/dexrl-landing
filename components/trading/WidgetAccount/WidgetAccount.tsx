"use client";

import links from "@/assets/links.json";
import ButtonConnect from "@/components/ButtonConnect";
import MaintenanceMessage from "@/components/MaintenanceMessage";
import { PrimaryHeader } from "@/components/header/PrimaryHeader";
import { Iconify } from "@/components/icon/Iconify";
import Confirmation from "@/components/modal/Confirmation";
import { textWithCenterEllipsis } from "@/helper/string";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ONRAMP_GOOGLE_ACTIVE, ONRAMP_METAMASK_ACTIVE } from "@/lib/constant";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import clsx from "clsx";
import { Link, useNavigate, useParams } from "@/lib/router-compat";
import { useLoginUserTrading } from "../hooks/useLoginUserTrading";
import { accountMenuItems } from "./WidgetAccount.menu";

const WidgetAccount = () => {
    const navigate = useNavigate();
    const { loginSession, clearLoginSession } = useTradingAuthStore();
    const {
        handleGoogleLogin,
        handleMetamaskLogin,
        isGoogleLoading,
        isMetamaskLoading,
        errorMetamask,
    } = useLoginUserTrading({});
    const {
        isOpen: isOpenModalLogout,
        onOpen: openModalLogout,
        onClose: onCloseModalLogout,
    } = useDisclosure();
    const { username } = useParams();

    const handleBuyCrypto = () => {
        navigate(-1);
    };

    const handleTransactionHistory = () => {
        navigate(`/${username}/transaction-history`);
    };

    const handleReceivingAccount = () => {
        navigate(`/${username}/receiving-account`);
    };

    const handleHelp = () => {
        const anchor = document.createElement("a");
        anchor.href = links.contact;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.click();
    };

    const menuHandlers: Record<string, () => void> = {
        "buy-crypto": handleBuyCrypto,
        "transaction-history": handleTransactionHistory,
        "receiving-account": handleReceivingAccount,
        help: handleHelp,
    };

    const menuItems = accountMenuItems.filter((menuItem) => {
        if (menuItem.isNeedLogin) {
            return loginSession;
        }
        return true;
    });

    return (
        <div className="flex flex-col gap-4 p-5 flex-1">

            <PrimaryHeader
                title="Settings"
                className={clsx("font-semibold text-xl", "text-[#003E2C]")}
                prevBtn={() => navigate(-1)}
            />

            {/* Not Login */}
            {!loginSession && (
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-[#003E2C] font-bold text-2xl mb-1">Welcome to dexRL</h3>
                    <p className="text-[#6A9080] text-md mb-8">Please login to continue</p>

                    <div className="flex gap-3 w-full">
                        <ButtonConnect
                            isMaintenance={!ONRAMP_GOOGLE_ACTIVE}
                            isLoading={isGoogleLoading}
                            onClick={handleGoogleLogin}
                            icon="flat-color-icons:google"
                            title="Google"
                            className="py-3 rounded-xl font-medium"
                            isCenter
                        />

                        <ButtonConnect
                            isMaintenance={!ONRAMP_METAMASK_ACTIVE}
                            isLoading={isMetamaskLoading}
                            onClick={handleMetamaskLogin}
                            icon="logos:metamask-icon"
                            title="Metamask"
                            className="py-3 rounded-xl font-medium"
                            isCenter
                        />
                    </div>
                    {errorMetamask && (
                        <div className="text-red-500 text-xs mt-1">{errorMetamask}</div>
                    )}
                </div>
            )}

            {/* User Section */}
            <div className="flex flex-col">
                {loginSession && (
                    <div className="flex items-center gap-3 py-4">
                        <div
                            className={clsx(
                                "flex items-center justify-center rounded-xl h-10 w-10",
                                "bg-[#ECF0EF]"
                            )}
                        >
                            {loginSession?.provider === "google" && (
                                <Iconify name="flat-color-icons:google" className="text-2xl" />
                            )}
                            {loginSession?.provider === "metamask" && (
                                <Iconify name="logos:metamask-icon" className="text-xl" />
                            )}
                        </div>
                        <p
                            className={clsx(
                                "text-base flex-1 overflow-hidden text-ellipsis font-normal",
                                "text-[#003E2C]"
                            )}
                        >
                            {loginSession?.user?.email || textWithCenterEllipsis(loginSession?.address || "", 15, 5)}
                        </p>
                        <button
                            onClick={() => {
                                openModalLogout();
                            }}
                            className={clsx(
                                "border rounded-lg px-4 py-2 text-sm font-normal transition-colors duration-150 cursor-pointer",
                                "border-[#C2CFCB] text-[#003E2C] hover:bg-[#ECF0EF]"
                            )}
                        >
                            Sign out
                        </button>
                    </div>
                )}

                <hr className="border-t border-[#C2CFCB]" />

                {/* Menu Items */}
                <div className="flex flex-col">
                    {menuItems?.map((menuItem, idx) => {
                        const isLast = idx === menuItems?.length - 1;
                        const buttonClassName = clsx(
                            "flex items-center gap-4 w-full py-4 px-2 transition-colors cursor-pointer",
                            !isLast && "border-b border-[#C2CFCB]",
                            "hover:bg-[#ECF0EF]/50 text-[#003E2C]"
                        );

                        if (menuItem.type === "link" && menuItem.link) {
                            return (
                                <Link key={menuItem.id} to={menuItem.link}>
                                    <button className={buttonClassName}>
                                        <Iconify name={menuItem.icon} className="text-2xl" />
                                        <span className="text-base font-normal">
                                            {menuItem.label}
                                        </span>
                                    </button>
                                </Link>
                            );
                        }

                        return (
                            <MaintenanceMessage key={menuItem.id} isMaintenance={menuItem.isMaintenance}>
                                <button
                                    onClick={menuHandlers[menuItem.id]}
                                    className={buttonClassName}
                                    disabled={menuItem.isMaintenance}
                                >
                                    <Iconify name={menuItem.icon} className="text-2xl" />
                                    <span className="text-base font-normal">{menuItem.label}</span>
                                </button>
                            </MaintenanceMessage>
                        );
                    })}
                </div>
            </div>

            <Confirmation
                open={isOpenModalLogout}
                onClose={onCloseModalLogout}
                onConfirm={() => {
                    clearLoginSession();
                    navigate(-1);
                }}
                title="Confirm Logout?"
                icon={<Iconify
                    name="mingcute:question-2-fill"
                    className="text-white text-4xl"
                />}
                confirmText="Logout"
                cancelText="Back"
                isDanger
            >
                <p className="text-sm text-[#003E2C] mb-4 text-center">
                    Are you sure you want to logout? You will need to reconnect your account
                </p>
            </Confirmation>
        </div>
    );
};

export default WidgetAccount;
