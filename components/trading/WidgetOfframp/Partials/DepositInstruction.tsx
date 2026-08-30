"use client";

import { QRCodeSVG } from "qrcode.react";
import { ChevronLeftIcon, Copy, Clock, Info, QrCode, XCircle, XIcon, RefreshCcwIcon } from "lucide-react";
import { useState, useEffect, useRef, useCallback, type FC } from "react";
import { useNavigate } from "@/lib/router-compat";
import clsx from "clsx";
import { formatNumber } from "@/helper";
import { formatDuration } from "@/helper/date";
import type { OfframpTransactionData } from "../WidgetOfframp.types";
import { DEPOSIT_VALIDITY_MS } from "../WidgetOfframp.data";
import { cancelOfframpTransaction } from "@/services/offrampService";
import { useModal } from "@/context/ModalContext";

interface DepositInstructionProps {
    transactionData?: OfframpTransactionData;
    onDepositConfirmed: () => void;
    onRetry?: () => void;
    isConfirming?: boolean;
}

const DepositInstruction: FC<DepositInstructionProps> = ({
    transactionData,
    onDepositConfirmed,
    onRetry,
    isConfirming = false,
}) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState<string>("");
    const [timeRemaining, setTimeRemaining] = useState<string>("10:00");
    const [isExpired, setIsExpired] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { confirm, close } = useModal()

    // Drag to close state
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);

    // Handle drag start
    const handleDragStart = useCallback((clientY: number) => {
        setIsDragging(true);
        dragStartY.current = clientY;
        setDragY(0);
    }, []);

    // Handle drag move
    const handleDragMove = useCallback((clientY: number) => {
        if (!isDragging) return;
        const deltaY = clientY - dragStartY.current;
        // Only allow dragging down (positive deltaY)
        if (deltaY > 0) {
            setDragY(deltaY);
        }
    }, [isDragging]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        // Close drawer if dragged more than 100px
        if (dragY > 100) {
            setIsDrawerOpen(false);
        }
        setDragY(0);
    }, [isDragging, dragY]);

    // Touch event handlers
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientY);
    }, [handleDragStart]);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        handleDragMove(e.touches[0].clientY);
    }, [handleDragMove]);

    const onTouchEnd = useCallback(() => {
        handleDragEnd();
    }, [handleDragEnd]);

    // Mouse event handlers
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        handleDragStart(e.clientY);
    }, [handleDragStart]);

    useEffect(() => {
        if (!isDragging) return;

        const onMouseMove = (e: MouseEvent) => {
            handleDragMove(e.clientY);
        };

        const onMouseUp = () => {
            handleDragEnd();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Countdown timer (10 minutes validity)
    useEffect(() => {
        if (!transactionData?.trx_date) return;

        const startTime = new Date(transactionData.trx_date).getTime();
        const expiryTime =
            transactionData?.deposit_address?.expires_at
                ? new Date(transactionData.deposit_address.expires_at).getTime()
                : startTime + DEPOSIT_VALIDITY_MS;

        // Calculate immediately on mount
        const calculateRemaining = () => {
            const now = Date.now();
            const remaining = expiryTime - now;

            if (remaining <= 0) {
                setIsExpired(true);
                setTimeRemaining("00:00");
                return false; // Stop interval
            }

            setTimeRemaining(formatDuration(remaining));
            return true; // Continue interval
        };

        // Run immediately
        if (!calculateRemaining()) {
            return; // Already expired, no need for interval
        }

        // Then run every second
        const interval = setInterval(() => {
            if (!calculateRemaining()) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [transactionData?.trx_date, transactionData?.deposit_address?.expires_at, transactionData?.status]);

    useEffect(() => {
        if (transactionData?.status !== 'expired') {
            setIsExpired(false)
        }
    }, [transactionData?.status])


    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(field);
            setTimeout(() => setCopied(""), 1500);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const handleCancelOrder = async () => {
        if (!transactionData) return
        confirm({
            title: "Cancel transaction?",
            icon: <XIcon className="w-8 h-8 text-[#ECF0EF]" />,
            description:
                "Are you sure you want to cancel? Any progress will be lost and you will need to start over.",
            cancelText: "Go Back",
            confirmText: "Yes, Cancel",
            onConfirm: async () => {
                await cancelOfframpTransaction(transactionData?.trx_no);
                navigate(-1);
                close();
            },
        });
    };

    const handleRetryFailed = async () => {
        confirm({
            title: "Retry Transaction?",
            icon: <RefreshCcwIcon className="w-8 h-8 text-[#ECF0EF]" />,
            description:
                "This will retry the deposit process and attempt to process your funds again. Do you want to continue?",
            onConfirm: async () => {
                onRetry?.();
                close();
            },
        });
    };

    const depositAddress =
        transactionData?.deposit_address?.address || "Loading...";
    const depositAmount = transactionData?.amount_token || 0;
    const tokenSymbol = transactionData?.from_token?.token_symbol || "";
    const chainName = transactionData?.from_chain?.chain_name || "";
    const receiveAmount = transactionData?.amount || 0;
    const trxNo = transactionData?.trx_no || "";
    const isCancelled = transactionData?.status === "cancelled";

    return (
        <div className="flex flex-col items-start gap-4 w-full min-h-[600px]">
            {/* Main Content */}
            <div className="flex flex-col items-start gap-4 w-full">
                {/* Header */}
                <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center justify-center w-full gap-4">
                        <button
                            type="button"
                            aria-label="Back"
                            className="flex items-center justify-center min-w-[36px] w-[36px] h-[36px] rounded-xl bg-[#ECF0EF] hover:bg-[#D8E3DF] transition-colors cursor-pointer"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-[#003E2C]" />
                        </button>
                        <h2 className="w-full font-extra text-[#003E2C] text-xl whitespace-nowrap">
                            Deposit Instruction
                        </h2>
                    </div>
                </div>

                <div className="space-y-2 w-full">
                    {/* You Will Receive Card */}
                    <div className={clsx("rounded-xl p-4 w-full", "bg-[#ECF0EF]/60")}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#003E2C] font-medium">You Will Receive</span>
                            <span className="text-sm font-bold text-[#003E2C]">
                                {formatNumber(receiveAmount)} IDRX
                            </span>
                        </div>
                    </div>

                    {/* Deposit Amount Card */}
                    <div className={clsx("rounded-xl p-4 w-full", "bg-[#ECF0EF]/60")}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#003E2C] font-medium">Deposit Amount</span>
                            <span className="text-sm font-bold text-[#003E2C]">
                                {depositAmount} {tokenSymbol} ({chainName})
                            </span>
                        </div>
                        <p className="text-xs text-[#6A9080] mt-2">
                            If a different amount is received, the swap will be executed based on the received amount using the current dexRL routing.
                        </p>
                    </div>

                    {/* Deposit Address Card */}
                    <div className={clsx("rounded-xl p-4 w-full", "bg-[#ECF0EF]/60")}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#003E2C] font-medium">Deposit Address</span>
                            <button
                                onClick={() => handleCopy(depositAddress, "address")}
                                className="flex items-center gap-1 text-[#003E2C] hover:text-[#003E2C] transition cursor-pointer text-sm"
                            >
                                <Copy className="w-4 h-4" />
                                <span>{copied === "address" ? "Copied!" : "Copy"}</span>
                            </button>
                        </div>
                        <p className="text-base text-[#003E2C] break-all font-normal leading-relaxed">
                            {depositAddress}
                        </p>
                    </div>

                    {/* Transaction ID Card */}
                    <div className={clsx("rounded-xl p-4 w-full", "bg-[#ECF0EF]/60")}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#003E2C] font-medium">Transaction ID</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-[#003E2C]">
                                    {trxNo}
                                </span>
                                <button
                                    onClick={() => handleCopy(trxNo, "trx_no")}
                                    className="flex items-center gap-1 text-[#003E2C] hover:text-[#003E2C] transition cursor-pointer"
                                >
                                    <Copy className="w-4 h-4" />
                                    <span className="text-sm">{copied === "trx_no" ? "Copied!" : "Copy"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* View Deposit Details Link */}
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="rounded-xl p-4 bg-[#ECF0EF]/60 flex items-center justify-center gap-2 w-full text-[#003E2C] hover:text-[#003E2C]/90 transition cursor-pointer"
                    >
                        <QrCode className="w-5 h-5" />
                        <span className="font-semibold">View Deposit Details</span>
                    </button>

                    {/* Trouble with Payment Link */}
                    <a
                        href="https://wa.me/6281214690096"
                        target="_blank"
                        className="flex mt-4 items-center justify-center w-full text-[#2D5C47] hover:text-[#2D5C47]/90 transition cursor-pointer text-sm"
                    >
                        Trouble with your Payment?
                    </a>

                    {/* Timer / Status */}
                    <div className={clsx("rounded-2xl p-4 w-full", "bg-[#ECF0EF]/60")}>
                        <div className="flex items-center">
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                                isCancelled ? "bg-red-500/20" : "bg-[#FEF3C7]"
                            )}>
                                {isCancelled ? (
                                    <XCircle className="w-6 h-6 text-red-500" />
                                ) : (
                                    <Clock
                                        className={clsx(
                                            "w-6 h-6",
                                            isExpired ? "text-red-600" : "text-[#D97706]"
                                        )}
                                    />
                                )}
                            </div>
                            <div className="text-[#003E2C] text-sm">
                                <div>
                                    {isCancelled ? (
                                        <span className="text-red-500">Order Cancelled</span>
                                    ) : isExpired ? (
                                        <span className="text-red-600">Order Expired</span>
                                    ) : (
                                        <>
                                            Valid for{" "}
                                            <span className="font-medium text-[#D97706]">
                                                {timeRemaining}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="text-xs text-[#6A9080] font-light">
                                    {isCancelled
                                        ? "This order has been cancelled"
                                        : isExpired
                                            ? "Please create a new order"
                                            : "Send the exact deposit amount shown above"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isCancelled ? (
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full mt-4 font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors bg-[#CBF23D] hover:bg-[#CBF23D] text-[#003E2C] cursor-pointer"
                        >
                            Create New Order
                        </button>
                    ) : isExpired ? (
                        <button
                            onClick={handleRetryFailed}
                            className="w-full mt-4 font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors bg-[#CBF23D] hover:bg-[#CBF23D] text-[#003E2C] cursor-pointer"
                        >
                            Retry
                        </button>
                    ) : (
                        <div className="flex justify-between gap-4 w-full mt-4">
                            <button
                                onClick={handleCancelOrder}
                                disabled={isConfirming}
                                className="w-full border border-solid border-[#E54747] text-[#E54747] hover:bg-[#E54747]/10 font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors cursor-pointer disabled:border-[#C2CFCB] disabled:text-[#6A9080] disabled:cursor-not-allowed"
                            >
                                Cancel Order
                            </button>
                            <button
                                onClick={onDepositConfirmed}
                                disabled={isConfirming}
                                className="w-full font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors bg-[#CBF23D] hover:bg-[#CBF23D] text-[#003E2C] cursor-pointer disabled:bg-[#ECF0EF] disabled:text-[#6A9080] disabled:cursor-not-allowed"
                            >
                                {isConfirming ? "Checking..." : "I've Paid"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Drawer Overlay */}
            {isDrawerOpen && (
                <div
                    className="absolute inset-0 bg-black/40 z-40 transition-opacity duration-300"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Inline Bottom Drawer for Deposit Details */}
            <div
                className={clsx(
                    "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl flex flex-col z-50 shadow-[0_-8px_30px_rgba(0,62,44,0.12)]",
                    "max-h-full",
                    !isDragging && "transition-transform duration-300 ease-out",
                    isDrawerOpen && !isDragging ? "translate-y-0" : !isDrawerOpen ? "translate-y-full" : ""
                )}
                style={{
                    transform: isDrawerOpen && isDragging ? `translateY(${dragY}px)` : undefined,
                }}
            >
                {/* Drag Handle Area */}
                <div
                    className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                >
                    <div className="w-12 h-1 bg-[#C2CFCB] rounded-full hover:bg-[#C2CFCB] transition-colors" />
                </div>

                <div className="flex flex-col items-center gap-5 px-4 pb-8 overflow-y-auto">

                    {/* Amount Header */}
                    <h3 className="text-lg font-semibold text-[#003E2C] font-inter">
                        Amount: {depositAmount} {tokenSymbol}
                    </h3>

                    {/* QR Code */}
                    <div className="">
                        <QRCodeSVG
                            value={depositAddress}
                            size={150}
                            level="H"
                            bgColor="white"
                        />
                    </div>

                    {/* Deposit Address */}
                    <div className={clsx("rounded-xl p-4 px-4 w-full", "bg-[#ECF0EF]/60")}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-base font-semibold text-[#003E2C]">
                                Deposit Address
                            </span>
                            <button
                                onClick={() => handleCopy(depositAddress, "drawer_address")}
                                className="flex items-center gap-1 text-[#003E2C] hover:text-[#003E2C]/80 transition cursor-pointer text-sm"
                            >
                                <Copy className="w-4 h-4" />
                                <span>{copied === "drawer_address" ? "Copied!" : "Copy"}</span>
                            </button>
                        </div>
                        <p className="text-[#003E2C] break-all font-normal">
                            {depositAddress}
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="rounded-xl border border-[#CBF23D]/50 py-4 px-4 w-full bg-[#CBF23D]/10">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-[#003E2C] shrink-0 mt-0.5" />
                            <p className="text-sm text-[#003E2C] leading-relaxed">
                                Upon sending your crypto to the wallet address above, we will promptly initiate the sale at the current market rate. Your funds will be transferred to you immediately, and may take between a few minutes to 2 business days to arrive.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepositInstruction;
