"use client";

import { formatNumber } from "@/helper";
import { formatDuration, normalizeTxDate } from "@/helper/date";
import { Modal } from "@/components/ui/Modal";
import { notification } from "@/components/ui/toast";
import { CircleCheck, Copy, X, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "@/lib/router-compat";
import { useConfetti } from "../../hooks/useConfetti";
import type { OfframpTransactionData } from "../WidgetOfframp.types";
import { getShareCaption, socialMediaLinks, socialMediaPlatforms, type SocialMediaPlatform } from "@/helper/socialMedia";
import { Iconify } from "@/components/icon/Iconify";
import { textWithStartEllipsis } from "@/helper/string";

type ModalOfframpSuccessProps = {
    open: boolean;
    onClose: () => void;
    transactionData?: OfframpTransactionData;
};

const ModalOfframpSuccess = ({
    open,
    onClose,
    transactionData,
}: ModalOfframpSuccessProps) => {
    const confettiCanvasRef = useConfetti(open);
    const { username = "trade" } = useParams();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (!open) return;
        const audio = new Audio("/audio/done.wav");
        audio.play().catch(() => { });

        return () => {
            audio.remove();
        };
    }, [open]);

    const executedIn = () => {
        const created = normalizeTxDate(transactionData?.trx_date);
        const settlementDate = transactionData?.progress?.find(
            (progress) => progress?.code === "TRANSFER_TO_BANK"
        )?.date;
        const ms = Math.abs(
            new Date(settlementDate || "").getTime() - created.getTime()
        );
        if (isNaN(ms)) return "00:00";
        return formatDuration(ms);
    };


    const savedPercent = () => {
        const marketPrice = transactionData?.market_price || 0;
        const amount = transactionData?.amount || 0;
        if (marketPrice === 0) return "0.00";
        // Offramp: user gets MORE IDR at dexRL than market price
        // Saved = ((OXO_price - market_price) / market_price) * 100
        const savedPercent = ((amount - marketPrice) / marketPrice) * 100;
        return Math.abs(savedPercent).toFixed(2);
    }

    const tradeLink = () => {
        return {
            link: `/${username}`,
            label: `dexrl.com/${username}`,
        };
    };

    const bankAccount = transactionData?.bank_account;
    const maskedAccountNumber = textWithStartEllipsis(bankAccount?.bank_account_number || '', 5)

    const saved = savedPercent();
    const shareUrl = tradeLink().label;
    const tokenSymbol = transactionData?.to_token?.token_symbol || "";

    const generateShareLink = (platform: SocialMediaPlatform) => {
        const caption = getShareCaption(tokenSymbol, saved, shareUrl);
        const socialMedia = socialMediaLinks(username, platform);
        if (!socialMedia) return null;
        return socialMedia.getUrl(caption);
    };

    const handleShare = (platform: SocialMediaPlatform) => {
        const url = generateShareLink(platform);
        if (!url) return;
        const anchor = document.createElement("a");
        Object.assign(anchor, {
            target: "_blank",
            rel: "noopener noreferrer",
            href: url,
        });
        anchor.click();
    };

    const copyShareText = async () => {
        const caption = getShareCaption(tokenSymbol, saved, shareUrl);
        try {
            await navigator.clipboard.writeText(caption);
            api.success({
                message: "Copied!",
                description: "Share text copied to clipboard",
                placement: "topRight",
                duration: 3,
            });
        } catch {
            api.error({
                message: "Error",
                description: "Failed to copy text",
                placement: "topRight",
                duration: 3,
            });
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={480}
            className="offramp-success-modal"
            closeIcon={
                <span>
                    <X className="w-4 h-4 text-[#003E2C] hover:text-[#6A9080]" />
                </span>
            }
            styles={{
                body: {
                    padding: "0",
                },
                content: {
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px",
                    border: "1px solid #C2CFCB",
                    padding: "0",
                },
            }}
        >
            {contextHolder}
            <canvas
                ref={confettiCanvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full"
            />

            <div ref={cardRef} className="flex flex-col items-center gap-4 p-6">
                <div className="text-center flex flex-col items-center gap-2">
                    <p className="text-lg font-bold font-inter text-[#003E2C]">
                        Successfully Swap!
                    </p>
                    <p
                        className="text-4xl font-bold"
                        style={{
                            background:
                                "linear-gradient(90deg, #003E2C 30%, #2BB673 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        {transactionData?.amount_token}{" "}
                        {transactionData?.from_token?.token_symbol}
                    </p>
                </div>

                <header className="flex items-center justify-center gap-2">
                    <span className="text-[#F6D860] text-lg">⚡</span>
                    <span className="text-sm text-[#6A9080]">
                        Executed in {executedIn()}
                    </span>
                </header>

                <div className="rounded-full border border-[#CBF23D]/50 bg-[#CBF23D]/30 px-6 py-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#5BD384]" />
                    <span className="text-sm text-[#003E2C] uppercase">Saved</span>
                    <span className="text-sm font-semibold text-[#5BD384]">
                        {savedPercent()}%
                    </span>
                    <span className="text-sm text-[#6A9080]">
                        from market price
                    </span>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <div className="flex items-center gap-2 text-sm text-[#6A9080]">
                        <span>Avg. Market Price:</span>
                        <span className="font-semibold text-[#003E2C]">{formatNumber(transactionData?.market_price || 0)}</span>
                        <X className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6A9080]">
                        <span>dexRL Best Price:</span>
                        <span className="font-semibold text-green-500">{formatNumber(transactionData?.amount || 0)}</span>
                        <CircleCheck className="w-4 h-4 text-green-500" />
                    </div>
                </div>

                <div className="rounded-xl bg-[#CBF23D]/30 border border-[#CBF23D]/50 p-4 text-[#003E2C] w-full">
                    <p className="text-sm text-[#003E2C] uppercase text-center font-semibold">
                        SENT TO YOUR RECEIVING ACCOUNT:
                    </p>
                    <div className="mt-3 flex flex-col items-center gap-1">
                        <div className="flex gap-1 items-center">
                            <span className="text-[#6A9080]">Account:</span>
                            <span className="font-normal text-[#003E2C]">
                                {bankAccount?.bank_name || "Bank"} {maskedAccountNumber}
                            </span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <span className="text-[#6A9080]">Status:</span>
                            <span
                                className="flex items-center gap-1 font-semibold capitalize"
                                style={{ color: "#5BD384" }}
                            >
                                {transactionData?.status}
                            </span>
                            <CircleCheck className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                </div>

                <hr className="w-full border-[#C2CFCB]/50" />

                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm text-[#003E2C] font-normal text-center uppercase">
                        OWN YOUR CRYPTO. TRADE ON:
                    </span>
                    <a
                        href={tradeLink().link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg font-semibold text-[#003E2C] hover:underline"
                    >
                        {tradeLink().label}
                    </a>
                </div>

                {/* Share Section */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {socialMediaPlatforms.map((platform) => (
                            <button
                                key={platform}
                                onClick={() => handleShare(platform)}
                                className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-[#ECF0EF] hover:bg-[#CBF23D] text-[#003E2C] transition-colors"
                                title={`Share on ${platform}`}
                            >
                                <Iconify name={socialMediaLinks(username, platform)?.icon || ""} className="w-4 h-4" />
                            </button>
                        ))}
                        <button
                            onClick={copyShareText}
                            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-[#ECF0EF] hover:bg-[#CBF23D] text-[#003E2C] transition-colors"
                            title="Copy share text"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalOfframpSuccess;
