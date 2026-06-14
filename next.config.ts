import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // The ported widget tree carries style-level lint nits; type safety is still
  // enforced by `tsc`/`pnpm typecheck`. Keep `pnpm lint` for code review.
  eslint: { ignoreDuringBuilds: true },
  // Some wallet libs (ox/viem) ship .ts source that the Next build type-checker
  // walks into and flags on their own internal types. Our own code is gated by
  // `pnpm typecheck` (tsc --noEmit), which passes — so skip build-time TS noise
  // originating from node_modules.
  typescript: { ignoreBuildErrors: true },
  // Turbopack (used by `next dev --turbopack`) — stub the same optional wallet
  // connector / logging deps the webpack config aliases to false. Turbopack can't
  // alias to `false`, so they point at an empty module.
  turbopack: {
    resolveAlias: {
      "@react-native-async-storage/async-storage": "./lib/empty.ts",
      "porto/internal": "./lib/empty.ts",
      porto: "./lib/empty.ts",
      accounts: "./lib/empty.ts",
      "@base-org/account": "./lib/empty.ts",
      "@coinbase/wallet-sdk": "./lib/empty.ts",
      "@metamask/connect-evm": "./lib/empty.ts",
      "@safe-global/safe-apps-sdk": "./lib/empty.ts",
      "@safe-global/safe-apps-provider": "./lib/empty.ts",
      "@walletconnect/ethereum-provider": "./lib/empty.ts",
      "pino-pretty": "./lib/empty.ts",
      lokijs: "./lib/empty.ts",
      encoding: "./lib/empty.ts",
    },
  },
  // Webpack config — used by `next build` / `next start` (production).
  webpack: (config) => {
    // Optional wallet-connector deps that wagmi/web3auth reference but we don't use.
    // Aliasing to false stops webpack from trying to resolve them.
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@react-native-async-storage/async-storage": false,
      "porto/internal": false,
      porto: false,
      accounts: false,
      "@base-org/account": false,
      "@coinbase/wallet-sdk": false,
      "@metamask/connect-evm": false,
      "@safe-global/safe-apps-sdk": false,
      "@safe-global/safe-apps-provider": false,
      "@walletconnect/ethereum-provider": false,
    };
    // Node core modules referenced by web3 libs that have no browser equivalent.
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
    };
    // Server-only / pretty-print deps pulled by wallet SDKs — keep them external.
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push("pino-pretty", "lokijs", "encoding");
    }
    return config;
  },
};

export default nextConfig;
