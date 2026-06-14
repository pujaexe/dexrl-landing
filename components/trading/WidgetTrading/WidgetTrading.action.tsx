"use client";

import { getQuote, type QuoteRequest } from "@/api/onrampService";
import { getOfframpQuote, createOfframpTransaction, type OfframpQuoteRequest, type OfframpQuoteData } from "@/api/offrampService";
import { createTradingTransaction } from "@/api/transactionService";
import { getAffiliateByUsername } from "@/api/affiliateService";
import { useModal } from "@/context/ModalContext";
import type { AffiliateUserInterface } from "@/data/interface";
import { formatTokenAmountWithoutRounding } from "@/helper";
import { getMetamaskBalance, isSupportedChain } from "@/helper/metamaskBalanceHelper";
import { formatRp } from "@/helper/rupiah";
import { textWithCenterEllipsis, textWithStartEllipsis } from "@/helper/string";
import { useDebounce } from "@/hooks/useDebounce";
import { useDisclosure } from "@/hooks/useDisclosure";
import { BITCOIN_CHAIN_ID, MIN_AMOUNT_SELL, POLYGON_CHAIN_ID, QUOTE_ADDRESS, SOLANA_CHAIN_ID, USDT_POLYGON_ADDRESS, getMinAmountBuy } from "@/lib/constant";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useTradingFormStore } from "@/store/tradingFormStore";
import { useReceivingAccountStore } from "@/store/receivingAccountStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "@/components/ui/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "@/lib/router-compat";
import {
    createTradingSchema,
    type TradingFormData,
} from "./WidgetTrading.scema";
const iconTrading = "/trading/icon-swap.svg";

export const useWidgetTradingAction = () => {
    const { getSelectedToken, formActive } = useTradingFormStore();
    const { loginSession, isConnected, wallet } = useTradingAuthStore();
    const { selectedAccount: receivingAccount, clearSelectedAccount } = useReceivingAccountStore();
    const navigate = useNavigate();
    const { username: affiliateUsername = "trade" } = useParams();
    const username = affiliateUsername === "trade" ? "dexrl" : affiliateUsername;

    const { data: affiliateData } = useQuery({
        queryKey: ["affiliate-user", username],
        queryFn: () => getAffiliateByUsername(username) as Promise<AffiliateUserInterface>,
        enabled: !!username,
    });
    const [api, contextHolder] = notification.useNotification();
    const { confirm, information, close } = useModal();
    const infoRef = useRef<boolean>(false);

    const {
        isOpen: isOpenSelectToken,
        onOpen: onOpenSelectToken,
        onClose: onCloseSelectToken,
    } = useDisclosure();

    const {
        isOpen: isOpenConnect,
        onOpen: onOpenConnect,
        onClose: onCloseConnect,
    } = useDisclosure();


    const [isUseMetamaskAddress, setIsUseMetamaskAddress] = useState(true);
    const selectedToken = getSelectedToken();
    const toChainId = selectedToken?.chainId;
    const toTokenAddress = selectedToken?.address || "";

    // MetaMask balance check for offramp
    const isMetamask = loginSession?.provider === "metamask";
    const isChainSupported = toChainId ? isSupportedChain(toChainId) : false;

    const { data: metamaskBalance } = useQuery({
        queryKey: ["metamask-balance", wallet?.address, toChainId, toTokenAddress],
        queryFn: async () => {
            if (!wallet?.eoaAddress || !toChainId) return null;
            const result = await getMetamaskBalance(
                wallet.eoaAddress,
                toChainId,
                toTokenAddress,
                selectedToken?.decimals || 18
            );
            return parseFloat(result.formatted);
        },
        enabled: !!wallet?.eoaAddress && !!toChainId && isMetamask && isChainSupported && formActive === "offramp",
        staleTime: 30000,
        refetchInterval: 60000,
        retry: false,
    });

    // FORM
    const schema = useMemo(
        () => createTradingSchema(toChainId, isConnected, formActive),
        [toChainId, isConnected, formActive]
    );

    const form = useForm<TradingFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: "",
            destinationAddress: loginSession?.address || "",
            receivingAccount: "",
        },
        mode: "all",
    });

    useEffect(() => {
        if (loginSession?.address) {
            if (isUseMetamaskAddress) {
                form.setValue("destinationAddress", loginSession.address);
            }
        } else if (!loginSession) {
            form.setValue("destinationAddress", "");
        }
    }, [loginSession, form, isUseMetamaskAddress]);

    // Sync receivingAccount from store to form
    useEffect(() => {
        if (receivingAccount) {
            form.setValue("receivingAccount", receivingAccount.bankAccountNumber, { shouldValidate: true });
        } else {
            form.setValue("receivingAccount", "", { shouldValidate: true });
        }
    }, [receivingAccount, form]);

    // Clear amount and re-validate when switching between onramp/offramp (different formats)
    useEffect(() => {
        form.setValue("amount", "");
    }, [formActive, form, selectedToken]);

    // GET QUOTE
    const amountValue = form.watch("amount");
    const parsedAmount = useMemo<number>(() => {
        if (!amountValue) return 0;
        if (formActive === "offramp") {
            return parseFloat(amountValue);
        }
        return parseFloat(amountValue.replace(/\./g, "").replace(/,/g, "."));
    }, [amountValue, formActive]);

    const addressValue = form.watch("destinationAddress");

    const debouncedAmount = useDebounce(parsedAmount, 700);
    const debouncedToAddress = useDebounce(addressValue, 700);

    // const fromAddress = wallet?.address || QUOTE_ADDRESS;
    const fromAddress = wallet?.address || QUOTE_ADDRESS;
    const isAmountValid = !form.formState.errors.amount;

    // For onramp: validate IDR input >= per-chain minimum (BTC/high-gas chains higher)
    // For offramp: no min amount check here (user inputs token amount, validate after getting IDR quote)
    const isEnabledQuote = useMemo(
        () => {
            const baseConditions =
                isAmountValid &&
                !!debouncedAmount &&
                debouncedAmount > 0 &&
                !!selectedToken &&
                !!toChainId &&
                !!toTokenAddress &&
                !!fromAddress;

            if (formActive === "onramp") {
                // For onramp, input is IDR - validate min amount per destination chain
                return baseConditions && debouncedAmount >= getMinAmountBuy(toChainId);
            }

            // For offramp, input is token amount - allow quote fetch, validate IDR after
            return baseConditions;
        },
        [isAmountValid, debouncedAmount, selectedToken, toChainId, toTokenAddress, fromAddress, formActive]
    );

    // RESET INFO REF
    useEffect(() => {
        infoRef.current = false;
    }, [debouncedAmount, debouncedToAddress, selectedToken, formActive]);

    // ONRAMP QUOTE (IDR → Token)
    const {
        data: onrampQuoteData,
        isLoading: isLoadingOnrampQuote,
        isError: isErrorOnrampQuote,
        isFetching: isFetchingOnrampQuote,
    } = useQuery({
        queryKey: [
            "onramp-quote",
            debouncedAmount,
            toChainId,
            toTokenAddress,
            fromAddress,
            debouncedToAddress,
        ],
        queryFn: () => {
            const quoteParams: QuoteRequest = {
                amountInIdr: debouncedAmount,
                toChainId: toChainId,
                toTokenAddress,
                fromAddress: fromAddress || "",
                toAddress: debouncedToAddress,
            };
            return getQuote(quoteParams);
        },
        enabled: isEnabledQuote && formActive === "onramp",
        staleTime: 30000,
        refetchInterval: (query) => {
            return query.state.error ? false : 60000;
        },
        retry: false,
    });

    // OFFRAMP QUOTE (Token → IDR)
    const {
        data: offrampQuoteData,
        isLoading: isLoadingOfframpQuote,
        isError: isErrorOfframpQuote,
        isFetching: isFetchingOfframpQuote,
    } = useQuery({
        queryKey: [
            "offramp-quote",
            debouncedAmount,
            toChainId,
            toTokenAddress,
            fromAddress,
        ],
        queryFn: () => {
            const quoteParams: OfframpQuoteRequest = {
                amountToken: debouncedAmount, // For offramp, this is token amount
                fromChainId: toChainId!, // In offramp, "to" token is actually the source
                fromTokenAddress: toTokenAddress,
                // fromAddress: fromAddress || "",
            };
            return getOfframpQuote(quoteParams);
        },
        enabled: isEnabledQuote && formActive === "offramp",
        staleTime: 30000,
        refetchInterval: (query) => {
            return query.state.error ? false : 60000;
        },
        retry: false,
    });

    // Unified quote data based on formActive
    const quoteData = formActive === "offramp" ? offrampQuoteData : onrampQuoteData;
    const isLoadingQuote = formActive === "offramp" ? isLoadingOfframpQuote : isLoadingOnrampQuote;
    const isErrorQuote = formActive === "offramp" ? isErrorOfframpQuote : isErrorOnrampQuote;
    const isFetchingQuote = formActive === "offramp" ? isFetchingOfframpQuote : isFetchingOnrampQuote;

    // Check if offramp IDR amount meets minimum after getting quote.
    // Prefer backend-computed flag (per-chain minimum), fallback to local constant.
    const offrampBelowMinimum = useMemo(() => {
        if (formActive !== "offramp" || !offrampQuoteData) return false;
        const data = offrampQuoteData as OfframpQuoteData;
        if (typeof data.belowMinimum === "boolean") return data.belowMinimum;
        const idrAmount = data.toAmountIdr || 0;
        const min = data.minAmountIdr ?? MIN_AMOUNT_SELL;
        return idrAmount < min;
    }, [formActive, offrampQuoteData]);

    // Check if onramp IDR input meets minimum (per destination chain).
    // Prefer backend-computed flag, fallback to local per-chain constant.
    const onrampBelowMinimum = useMemo(() => {
        if (formActive !== "onramp") return false;
        if (!debouncedAmount || debouncedAmount <= 0) return false;
        if (onrampQuoteData && typeof onrampQuoteData.belowMinimum === "boolean") {
            return onrampQuoteData.belowMinimum;
        }
        const min = onrampQuoteData?.minAmountIdr ?? getMinAmountBuy(toChainId);
        return debouncedAmount < min;
    }, [formActive, debouncedAmount, onrampQuoteData, toChainId]);

    // Check if MetaMask balance is insufficient for offramp
    const insufficientBalance = useMemo(() => {
        if (formActive !== "offramp") return false;
        if (!isMetamask || !isChainSupported) return false;
        if (metamaskBalance === null || metamaskBalance === undefined) return false;
        if (!parsedAmount || parsedAmount <= 0) return false;
        return parsedAmount > metamaskBalance;
    }, [formActive, isMetamask, isChainSupported, metamaskBalance, parsedAmount]);

    useEffect(() => {
        if (infoRef.current) return;
        if (isErrorQuote) {
            infoRef.current = true;
            information({
                title: "No Swap Route Found",
                description: "This usually happens due to amount selected to low, low liquidity, or high gas fees.",
            });
        }
    }, [isErrorQuote, information]);

    const closeModal = () => {
        onCloseSelectToken();
        onCloseConnect();
    };

    // ONRAMP Transaction Creation
    const createOnrampTransactionMutation = useMutation({
        mutationFn: async () => {
            if (!quoteData || !selectedToken || !toChainId || !toTokenAddress) {
                throw new Error("Missing required data for transaction");
            }

            // For Metamask: use eoaRecord, for Google: use addressRecord
            const addressRecordId = wallet?.addressRecord?.id;

            if (!addressRecordId) {
                throw new Error("Wallet address record not available");
            }

            const amountInIdr = parseFloat(
                form.getValues("amount").replace(/\./g, "").replace(/,/g, ".")
            );

            const destinationAddress = form.getValues("destinationAddress");
            if (!destinationAddress) {
                throw new Error("Destination address is required");
            }

            const fromChainId = POLYGON_CHAIN_ID;
            const fromTokenAddress = USDT_POLYGON_ADDRESS;

            const transactionData = {
                amount: amountInIdr,
                toAddress: destinationAddress,
                toChainId: toChainId,
                fromChainId: fromChainId,
                toToken: toTokenAddress,
                fromToken: fromTokenAddress,
                amountToken: parseFloat(quoteData.toAmountMin || quoteData.toAmount),
                addressId: addressRecordId,
                affiliator: username,
            };

            return await createTradingTransaction(transactionData);
        },
        onSuccess: (result) => {
            if (result.success && result.data) {
                close();
                api.success({
                    message: "Transaction Created",
                    description: `Transaction ${result.data.trx_no} created successfully.`,
                    placement: "topRight",
                    duration: 5,
                });
                navigate(`/swap/${result.data.trx_no}`);
            } else {
                throw new Error(result.message || "Failed to create transaction");
            }
        },
        onError: (error: any) => {
            console.error("Failed to create transaction:", error);
            api.error({
                message: "Transaction Failed",
                description: error?.message || "Failed to create transaction. Please try again.",
                placement: "topRight",
                duration: 5,
            });
        },
    });

    // OFFRAMP Transaction Creation
    const createOfframpTransactionMutation = useMutation({
        mutationFn: async () => {
            if (!quoteData || !selectedToken || !toChainId || !toTokenAddress) {
                throw new Error("Missing required data for transaction");
            }

            // For Metamask: use eoaRecord, for Google: use addressRecord
            const addressRecordId = wallet?.addressRecord?.id;

            if (!addressRecordId) {
                throw new Error("Wallet address record not available");
            }

            if (!receivingAccount?.id) {
                throw new Error("Bank account not selected");
            }

            // For offramp: input uses dot as decimal (e.g., "1.2")
            const amountToken = parseFloat(form.getValues("amount"));

            // For offramp, toAmountIdr is the IDR amount user will receive
            const offrampQuote = quoteData as OfframpQuoteData;
            const amountIdr = offrampQuote.toAmountIdr || 0;

            const transactionData = {
                amount: amountIdr, // IDR amount to receive
                address_id: addressRecordId,
                from_chain_id: toChainId, // Source chain (where user's token is)
                from_token: toTokenAddress, // Source token
                amount_token: amountToken, // Token amount being sold
                bank_id: receivingAccount.id,
                login_provider: loginSession?.provider || "google", // For MetaMask: skip deposit address
                affiliator: username,
            };

            return await createOfframpTransaction(transactionData);
        },
        onSuccess: (result) => {
            if (result.success && result.data) {
                close();
                api.success({
                    message: "Offramp Transaction Created",
                    description: `Transaction ${result.data.trx_no} created successfully.`,
                    placement: "topRight",
                    duration: 5,
                });
                // Navigate to offramp widget
                navigate(`/redeem/${result.data.trx_no}`);
            } else {
                throw new Error(result.message || "Failed to create offramp transaction");
            }
        },
        onError: (error: any) => {
            console.error("Failed to create offramp transaction:", error);
            api.error({
                message: "Transaction Failed",
                description: error?.message || "Failed to create offramp transaction. Please try again.",
                placement: "topRight",
                duration: 5,
            });
        },
    });

    const onSubmitTransaction = async (data: TradingFormData) => {
        if (!quoteData) {
            api.error({
                message: "Quote Error",
                description: "Quote data not available. Please wait for quote to load.",
                placement: "topRight",
                duration: 5,
            });
            return;
        }

        if (!selectedToken || !toChainId || !toTokenAddress) {
            api.error({
                message: "Token Selection Error",
                description: "Please select a token to swap.",
                placement: "topRight",
                duration: 5,
            });
            return;
        }


        // OFFRAMP FLOW
        if (formActive === "offramp") {
            if (!receivingAccount?.id) {
                api.error({
                    message: "Bank Account Required",
                    description: "Please select a bank account to receive funds.",
                    placement: "topRight",
                    duration: 5,
                });
                return;
            }

            const offrampQuote = quoteData as OfframpQuoteData;

            // Validate minimum IDR amount for offramp (per-chain minimum from backend)
            if (offrampBelowMinimum) {
                const min = offrampQuote?.minAmountIdr ?? MIN_AMOUNT_SELL;
                api.error({
                    message: "Minimum Amount Not Met",
                    description: `Minimum sell amount for this chain is Rp ${formatRp(String(min))}. Your current amount converts to Rp ${formatRp(String(offrampQuote?.toAmountIdr || 0))}.`,
                    placement: "topRight",
                    duration: 5,
                });
                return;
            }
            confirm({
                title: "Confirm Swap?",
                icon: <img alt="Swap" src={iconTrading} className="w-6 h-6 text-[#003E2C]" />,
                description: (
                    <div className="flex flex-col gap-1 w-full text-center">
                        <div className="text-[#003E2C]">
                            <span className="text-sm opacity-80">From: </span>
                            <span className="font-semibold">{data?.amount} {selectedToken?.symbol}</span>
                        </div>
                        <div className="text-[#003E2C]">
                            <span className="text-sm opacity-80">To: </span>
                            <span className="font-semibold">{formatRp(String(offrampQuote?.toAmountIdr || 0))} IDRX</span>
                        </div>
                        <div className="text-[#003E2C]">
                            <span className="text-sm opacity-80">Account: </span>
                            <span className="font-semibold">
                                {receivingAccount?.bankName} {textWithStartEllipsis(receivingAccount?.bankAccountNumber || '', 5)}
                            </span>
                        </div>
                        <div className="text-[#003E2C]">
                            <span className="text-sm opacity-80">Redeem Fee: </span>
                            <span className="font-semibold">
                                <span className="font-semibold">{formatRp("5000")} IDRX</span>
                            </span>
                        </div>

                        {/* BTC warning */}
                        {Number(selectedToken?.chainId) === BITCOIN_CHAIN_ID && (
                            <div className="text-[#003E2C] text-sm mt-4">
                                ⚠️ BTC redemptions may take additional time due to network confirmation.
                            </div>
                        )}
                    </div>
                ),
                onConfirm: async () => {
                    await createOfframpTransactionMutation.mutateAsync();
                },
            });
            return;
        }

        // ONRAMP FLOW
        // Validate minimum IDR amount for onramp (per-chain minimum, with backend fallback)
        if (onrampBelowMinimum) {
            const min = onrampQuoteData?.minAmountIdr ?? getMinAmountBuy(toChainId);
            api.error({
                message: "Minimum Amount Not Met",
                description: `Minimum buy amount for this chain is Rp ${formatRp(String(min))}.`,
                placement: "topRight",
                duration: 5,
            });
            return;
        }

        confirm({
            title: "Confirm Swap?",
            icon: <img alt="Swap" src={iconTrading} className="w-6 h-6 text-[#003E2C]" />,
            description: (
                <div className="flex flex-col gap-1 w-full text-center">
                    <div className="text-[#003E2C]">
                        <span className="text-sm opacity-80">From: </span>
                        <span className="font-semibold">{data?.amount} IDRX</span>
                    </div>
                    <div className="text-[#003E2C]">
                        <span className="text-sm opacity-80">To: </span>
                        <span className="font-semibold">{formatTokenAmountWithoutRounding(String(quoteData?.toAmountMin || 0), 6)} {selectedToken?.symbol}</span>
                    </div>
                    <div className="text-[#003E2C]">
                        <span className="text-sm opacity-80">Destination: </span>
                        <span className="font-semibold">
                            {textWithCenterEllipsis(data?.destinationAddress || '', 5, 5)}
                        </span>
                    </div>

                    {/* BTC warning */}
                    {Number(selectedToken?.chainId) === BITCOIN_CHAIN_ID && (
                        <div className="text-[#003E2C] text-sm mt-4">
                            ⚠️ BTC Swap may take additional time due to network confirmation.
                        </div>
                    )}
                </div>
            ),
            onConfirm: async () => {
                await createOnrampTransactionMutation.mutateAsync();
            },
        });
    };

    const tokenSelectionError = useMemo(() => {
        if (loginSession?.provider === "metamask") {
            const chains = [SOLANA_CHAIN_ID, BITCOIN_CHAIN_ID];
            if (chains.includes(Number(selectedToken?.chainId))) {
                return `Metamask not supported for ${selectedToken?.chain?.name}. Please continue with Google`;
            }
        }
        return "";
    }, [loginSession?.provider, selectedToken]);

    // Bank Account Handlers
    const handleAddBankAccount = () => {
        navigate(`/${username}/receiving-account`);
    };

    const handleClearBankAccount = () => {
        clearSelectedAccount();
        form.setValue("receivingAccount", "");
    };

    return {
        isOpenSelectToken,
        onOpenSelectToken,
        isOpenConnect,
        onOpenConnect,
        closeModal,
        loginSession,
        form,
        errors: form.formState.errors,
        isSubmitting: form.formState.isSubmitting,
        handleSubmit: form.handleSubmit,
        isUseMetamaskAddress,
        setIsUseMetamaskAddress,

        quoteData,
        isLoadingQuote,
        isErrorQuote,
        isFetchingQuote,
        isEnabledQuote,
        offrampBelowMinimum,
        onrampBelowMinimum,
        insufficientBalance,
        metamaskBalance,
        onSubmitTransaction,
        notificationContextHolder: contextHolder,

        tokenSelectionError,
        selectedToken,
        receivingAccount,
        handleAddBankAccount,
        handleClearBankAccount,

    };
};
