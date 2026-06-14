"use client";

import {
  getListChains,
  getListOtherToken,
  getListTokenNew,
} from "@/api/tokenService";
import { Iconify } from "@/components/icon/Iconify";
import RenderIf from "@/components/Renderif";
import type { ChainInterface, TokenInterface } from "@/data";
import { switchToChain } from "@/helper/smartAccountHelper";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useTradingFormStore } from "@/store/tradingFormStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "@/lib/router-compat";
import { getAffiliateByUsername } from "@/api/affiliateService";
import type { AffiliateUserInterface } from "@/data/interface";
import {
  buildTokenWhitelist,
  isTokenAllowed,
} from "@/helper/cryptoSettingsHelper";
import Chains from "./Chains";
import EmptySearchResult from "./EmptySearchResult";
import FilteredChain from "./FilteredChain";
import { groupTokensByChain } from "./ModalSelectToken.action";
import SearchToken from "./SearchToken";
import TokenItem from "./TokenItem";

interface ModalTokenListProps {
  open: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

// EVM chain IDs supported for chain switching
const EVM_CHAIN_IDS = [1, 56, 137, 8453];

// Solana chain ID - for offramp, only native token is supported
const SOLANA_CHAIN_ID = 1151111081099710;

const ModalSelectToken: React.FC<ModalTokenListProps> = ({ open, onClose }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setSelectedToken, getSelectedToken, formActive } = useTradingFormStore();
  const { loginSession } = useTradingAuthStore();
  const selectedToken = getSelectedToken();
  const isMetamask = loginSession?.provider === "metamask";
  const isOfframp = formActive === "offramp";

  const [params, setParams] = useState<{
    page?: number;
    pageSize?: number;
    chain_id?: string | number;
    search?: string;
  }>({
    page: 1,
    pageSize: 10,
    chain_id: 137,
    search: "",
  });

  const handleSearch = useDebounceCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setParams({ ...params, search: e.target.value });
    },
    500
  );

  const { username: affiliateUsername = "trade" } = useParams();
  const hasAffiliator = affiliateUsername !== "trade";
  const username = affiliateUsername === "trade" ? "dexrl" : affiliateUsername;

  const { data: affiliateData } = useQuery({
    queryKey: ["affiliate-user", username],
    queryFn: () =>
      getAffiliateByUsername(username) as Promise<AffiliateUserInterface>,
    enabled: !!username,
  });

  const whitelistTokens = hasAffiliator
    ? affiliateData?.affiliate?.crypto_settings?.token
    : undefined;
  const hasTokenWhitelist = !!whitelistTokens && whitelistTokens.length > 0;

  const { currentChainAddresses, allWhitelistAddresses, legacyWhitelistSymbols } =
    useMemo(() => {
      const { addressesByChain, legacySymbols } =
        buildTokenWhitelist(whitelistTokens);
      return {
        currentChainAddresses:
          addressesByChain.get(Number(params.chain_id)) ?? [],
        allWhitelistAddresses: Array.from(addressesByChain.values()).flat(),
        legacyWhitelistSymbols: Array.from(legacySymbols),
      };
    }, [whitelistTokens, params.chain_id]);

  const [hasInitializedChain, setHasInitializedChain] = useState(false);

  // Initialize chain_id to the first allowed chain for the affiliator
  useEffect(() => {
    if (
      !hasInitializedChain &&
      hasAffiliator &&
      affiliateData?.affiliate?.crypto_settings?.chain
    ) {
      const allowedChains = affiliateData.affiliate.crypto_settings.chain;
      if (allowedChains.length > 0) {
        const firstAllowedChainId = allowedChains[0].value;
        setParams((prev) => ({ ...prev, chain_id: firstAllowedChainId }));
        setHasInitializedChain(true);
      }
    }
  }, [hasAffiliator, affiliateData, hasInitializedChain]);

  const { data: chains = [] } = useQuery<ChainInterface[]>({
    queryKey: ["chains"],
    queryFn: () => getListChains(),
    select: (data: any) => {
      let filtered = data;
      if (
        hasAffiliator &&
        affiliateData?.affiliate?.crypto_settings?.chain &&
        affiliateData.affiliate.crypto_settings.chain.length > 0
      ) {
        const allowedChainIds = affiliateData.affiliate.crypto_settings.chain.map(
          (c) => c.value
        );
        filtered = data.filter((chain: any) =>
          allowedChainIds.includes(chain.chain_id)
        );
      }

      return filtered.map((chain: any) => ({
        id: chain.chain_id,
        logoURI: chain.logo_url,
        key: chain.chain_key,
        name: chain.chain_name,
        metamask: {
          rpcUrls: chain.rpc_urls,
          blockExplorerUrls: chain.block_explorer_urls,
        },
        nativeToken: { address: chain.native_token_address },
        color: chain.color,
        tokenCount: chain.tokenCount,
      }));
    },
  });

  const { data: otherTokens, isLoading: isLoadingOtherTokens } = useQuery({
    queryKey: [
      "other-tokens",
      params,
      hasTokenWhitelist,
      allWhitelistAddresses,
      legacyWhitelistSymbols,
    ],
    queryFn: () =>
      getListOtherToken({
        ...params,
        hasTokenWhitelist,
        allowedTokenAddresses: allWhitelistAddresses,
        allowedTokenSymbols: legacyWhitelistSymbols,
      }),
    select: (data) => {
      let tokens = data.data;
      if (hasTokenWhitelist) {
        tokens = tokens.filter((token) =>
          isTokenAllowed(token, whitelistTokens)
        );
      }

      return tokens.map((token) => {
        return {
          symbol: token.token_symbol,
          name: token.token_name,
          logoURI: token.logo_url,
          chainId: token.chain_id,
          decimals: token.token_decimals,
          address: token.token_address,
          isActive: token.is_active,
          chain: chains.find((chain) => chain.id === token.chain_id),
        };
      });
    },
    enabled: !!params.search,
  });

  const {
    data: tokenPages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [
      "tokens",
      params,
      hasTokenWhitelist,
      currentChainAddresses,
      legacyWhitelistSymbols,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getListTokenNew({
        ...params,
        page: pageParam,
        hasTokenWhitelist,
        allowedTokenAddresses: currentChainAddresses,
        allowedTokenSymbols: legacyWhitelistSymbols,
      }),
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
          let tokens = item.data;
          if (hasTokenWhitelist) {
            tokens = tokens.filter((token) =>
              isTokenAllowed(token, whitelistTokens)
            );
          }

          return {
            ...item,
            data: tokens.map((token) => {
              return {
                symbol: token.token_symbol,
                name: token.token_name,
                logoURI: token.logo_url,
                chainId: token.chain_id,
                decimals: token.token_decimals,
                address: token.token_address,
                isActive: token.is_active,
                chain: chains.find((chain) => chain.id === token.chain_id),
              };
            }),
          };
        }),
      };
    },
  });

  const grouped = useMemo(() => {
    let tokens = tokenPages?.pages.flatMap((page) => page.data) || [];

    // For offramp on Solana, only show native token (SOL)
    if (isOfframp && params.chain_id === SOLANA_CHAIN_ID) {
      tokens = tokens.filter((token) => {
        // Native SOL address
        const nativeSolAddress = "11111111111111111111111111111111";
        return token.address?.toLowerCase() === nativeSolAddress.toLowerCase();
      });
    }

    return groupTokensByChain(tokens);
  }, [tokenPages, isOfframp, params.chain_id]);

  const filteredChains =
    useMemo(() => {
      return chains.filter((chain) =>
        [chain.name, chain.key, String(chain.id)].some((field) =>
          field.toLowerCase().includes(params?.search?.toLowerCase() || "")
        )
      );
    }, [params.search, chains]) || [];

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
    if (!open) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, open]);

  const handleOnSelect = async (value: TokenInterface) => {
    onClose?.();
    setSelectedToken(value);

    // Switch chain for MetaMask users when selecting EVM token
    if (isMetamask && value.chainId && EVM_CHAIN_IDS.includes(value.chainId)) {
      try {
        await switchToChain(value.chainId);
      } catch (error) {
        console.error("[ModalSelectToken] Failed to switch chain:", error);
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className={clsx(
            "absolute inset-0 z-40 transition-opacity duration-300",
            "bg-black/70"
          )}
          onClick={onClose}
        />
      )}

      <div
        className={clsx(
          "absolute left-0 right-0 bottom-0 top-0 rounded-t-xl shadow-lg transform transition-transform duration-300 z-50 flex flex-col",
          open ? "translate-y-0" : "translate-y-full",
          "bg-white text-[#003E2C]"
        )}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 shrink-0" id="modal-select-token-header">
          <div className="flex justify-end pt-3 px-4 items-center">
            <h1 className="text-md font-semibold flex-1">
              Select Cryptocurrency
            </h1>
            <button
              onClick={onClose}
              className={clsx(
                "cursor-pointer p-1 rounded-full transition-colors",
                "hover:bg-[#ECF0EF]"
              )}
            >
              <Iconify
                name="material-symbols:close-rounded"
                className="text-xl text-[#6A9080]"
              />
            </button>
          </div>

          <SearchToken
            defaultValue={params.search || ""}
            handleSearch={handleSearch}
            ref={searchRef}
          />

          <Chains
            chains={chains}
            selectedChain={
              params.chain_id
                ? chains.find((chain) => chain.id === params.chain_id)
                : null
            }
            handleSelectedChain={(chain) => {
              if (searchRef.current) {
                searchRef.current.value = "";
              }
              setParams({ ...params, chain_id: chain.id, search: "" });
            }}
          />
        </div>

        <RenderIf
          isTrue={
            (!isLoading && grouped?.length > 0) ||
            (!!params?.search && filteredChains?.length > 0)
          }
        >
          <div
            ref={scrollContainerRef}
            className={clsx(
              "flex flex-col gap-0 overflow-y-auto mt-3",
              "flex-1 min-h-0"
            )}
          >
            <RenderIf isTrue={!!params?.search && filteredChains?.length > 0}>
              <FilteredChain
                filteredChains={filteredChains}
                onSelectChain={(chain) =>
                  setParams({ ...params, chain_id: chain.id })
                }
              />
            </RenderIf>

            {grouped.map((group, indexGroup) => (
              <div
                key={`${group.chain.id}_${indexGroup}`}
                className="flex flex-col"
              >
                <span
                  className={clsx(
                    "font-medium text-sm px-4 bg-slate-50 text-[#2D5C47] py-2 mb-1",
                    "bg-[#ECF0EF] text-[#003E2C]"
                  )}
                >
                  Tokens on {group.chain.name}
                </span>
                {group.tokens.map((token, index) => (
                  <TokenItem
                    key={`${token.address}_${token.chainId}_${index}_${indexGroup}`}
                    token={token}
                    handleOnSelect={handleOnSelect}
                    isDark
                    isSelected={
                      selectedToken?.address === token.address &&
                      selectedToken?.chainId === token.chainId
                    }
                  />
                ))}
              </div>
            ))}

            {/* Loading indicator when fetching more */}
            {isFetching && hasNextPage && (
              <div className="flex items-center justify-center py-4">
                <span
                  className="inline-block w-6 h-6 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"
                  style={{ borderTopColor: "#94a3b8" }}
                />
              </div>
            )}

            {!!otherTokens &&
              otherTokens?.length > 0 &&
              !isLoadingOtherTokens && (
                <div className="flex flex-col">
                  <span
                    className={clsx(
                      "font-medium text-sm px-4 bg-slate-50 text-[#2D5C47] py-2 mb-1",
                      "bg-[#ECF0EF] text-[#003E2C]"
                    )}
                  >
                    Other Tokens
                  </span>
                  {otherTokens.map((token, index) => (
                    <TokenItem
                      key={`${token.address}_${token.chainId}_${index}_other-tokens`}
                      token={token}
                      handleOnSelect={handleOnSelect}
                      isDark
                      isSelected={
                        selectedToken?.address === token.address &&
                        selectedToken?.chainId === token.chainId
                      }
                    />
                  ))}
                </div>
              )}
          </div>
        </RenderIf>

        <RenderIf
          isTrue={
            !isLoading &&
            grouped?.length === 0 &&
            !!params?.search &&
            params?.search?.length > 0 &&
            filteredChains?.length === 0
          }
        >
          <EmptySearchResult />
        </RenderIf>
      </div>
    </>
  );
};

export default ModalSelectToken;
