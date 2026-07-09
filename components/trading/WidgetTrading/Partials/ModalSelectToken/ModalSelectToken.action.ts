"use client";

import type { ChainInterface, TokenInterface } from "@/data";

interface GroupedToken {
    chain: ChainInterface;
    tokens: TokenInterface[];
}

export const groupTokensByChain = (tokens: TokenInterface[]): GroupedToken[] => {
    return Object.values(
        tokens.reduce<Record<string, GroupedToken>>((acc, token) => {
            if (!token.chain || token.chainId === undefined) {
                return acc;
            }

            const chainId = String(token.chainId);

            if (!acc[chainId]) {
                acc[chainId] = {
                    chain: token.chain,
                    tokens: []
                };
            }

            acc[chainId].tokens.push(token);

            return acc;
        }, {})
    );
};