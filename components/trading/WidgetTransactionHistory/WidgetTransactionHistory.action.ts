"use client";

import { getUserTransactionHistory } from "@/services/transactionService";
import { formatTokenAmount } from "@/helper";
import { normalizeTxDate } from "@/helper/date";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

export const useWidgetTransactionHistoryAction = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { wallet } = useTradingAuthStore();
    const { search, debouncedSearch, setSearch } = useDebouncedSearch('', 500)

    const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['user-transaction-history', wallet?.addressRecord?.id, debouncedSearch],
        queryFn: ({ pageParam = 1 }) => getUserTransactionHistory(wallet?.addressRecord?.id, pageParam, 10, debouncedSearch),
        getNextPageParam: (lastPage, _pages) => {
            const currentPage = lastPage.meta.page;
            const totalPages = lastPage.meta.totalPages;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
        select: (data) => {
            return {
                ...data,
                pages: data.pages.map((item) => {
                    return {
                        ...item,
                        data: item.data.map((trx) => {
                            return {
                                transactionId: trx.trx_no,
                                trxType: trx.trx_type,
                                amount: formatTokenAmount(trx.amount_token),
                                swapTo: trx.trx_type === "buy" ? trx?.to_chain?.chain_name : "IDRX",
                                chain: trx.trx_type === "buy" ? trx?.to_chain?.chain_name : trx?.from_chain?.chain_name,
                                token:
                                    trx.trx_type === "buy" ? trx?.to_token_detail?.token_symbol : trx?.from_token_detail?.token_symbol,
                                orderDate: normalizeTxDate(trx.trx_date),
                                status: trx.status,
                            }
                        })
                    }
                })
            }
        },
        enabled: !!wallet?.addressRecord?.id,
    });

    const transactions = useMemo(() => {
        return data?.pages.map((page) => page.data).flat() || [];
    }, [data]);

    // Handle scroll to load more
    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container || !hasNextPage || isFetching) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        if (distanceFromBottom < 100) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetching, fetchNextPage]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);



    const handleContactSupport = () => {
        const contactSupport = "https://wa.me/6281214690096";

        const anchor = document.createElement("a");
        Object.assign(anchor, {
            target: "_blank",
            rel: "noopener noreferrer",
            href: contactSupport,
        });
        anchor.click();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return {
        transactions,
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        handleContactSupport,
        handleSearchChange,
        scrollContainerRef,
        search,
    };
};