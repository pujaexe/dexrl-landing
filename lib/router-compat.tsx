"use client";

/**
 * Compatibility shim so the ported trading widget (originally react-router based)
 * runs on the Next.js App Router without rewriting every call site.
 *
 * Single "house" model: the landing widget always operates under one affiliate
 * (NEXT_PUBLIC_HOUSE_USERNAME). Transaction progress lives at /swap?tx= (onramp)
 * and /redeem?tx= (offramp), so route params are derived from the `tx` query param.
 */
import { useCallback } from "react";
import {
  useRouter,
  useSearchParams,
  useParams as useNextParams,
  usePathname,
} from "next/navigation";
import NextLink from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useWidgetViewStore } from "@/store/widgetViewStore";

export const HOUSE_USERNAME = process.env.NEXT_PUBLIC_HOUSE_USERNAME ?? "dexrl";

/**
 * react-router useNavigate() shim. Widget-internal destinations (account,
 * transaction-history, receiving-account) become in-widget panel switches via
 * the view store; tx progress paths map to the real /swap and /redeem routes.
 */
export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  // Standalone tx-progress route (/swap/<tx> or /redeem/<tx>) has no in-widget
  // panel system, so widget-internal nav there must change the actual route.
  const onProgressPage = /^\/(swap|redeem)\/[^/]+$/.test(pathname || "");

  return useCallback(
    (path: string | number) => {
      const { push, back, reset } = useWidgetViewStore.getState();
      const u = HOUSE_USERNAME;

      // navigate(-1) / back
      if (typeof path === "number") {
        if (onProgressPage) router.push("/swap");
        else back();
        return;
      }

      const clean = path.split("?")[0];

      // Real tx progress routes
      if (clean.startsWith("/swap") || clean.startsWith("/redeem")) {
        router.push(path);
        return;
      }
      // Legacy offramp progress: /<user>/redeem/<txNo> -> /redeem/<txNo>
      if (clean.startsWith(`/${u}/redeem/`)) {
        router.push(`/redeem/${clean.split("/").pop()}`);
        return;
      }

      // Helper: set the panel and (on a progress route) jump to the trade page
      const goPanel = (panel: "account" | "history" | "receiving" | "receiving-add") => {
        push(panel);
        if (onProgressPage) router.push("/swap");
      };

      // In-widget panels
      if (clean === `/${u}` || clean === "/") {
        reset();
        if (onProgressPage) router.push("/swap");
        return;
      }
      if (clean === `/${u}/account`) return goPanel("account");
      if (clean === `/${u}/transaction-history`) return goPanel("history");
      if (clean === `/${u}/receiving-account/add`) return goPanel("receiving-add");
      if (clean === `/${u}/receiving-account`) return goPanel("receiving");
      // Legacy onramp progress: /<user>/<txNo> -> /swap/<txNo>
      if (clean.startsWith(`/${u}/`)) {
        router.push(`/swap/${clean.split("/").pop()}`);
        return;
      }
      router.push(path);
    },
    [router, onProgressPage],
  );
}

/** react-router useParams() -> { username, tx_no, txNo } in the house model.
 *  Reads the tx from the dynamic route segment (/swap/[tx]) first, then falls
 *  back to the legacy ?tx= query param. */
export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  const params = useNextParams();
  const sp = useSearchParams();
  const tx = (params?.tx as string | undefined) ?? sp.get("tx") ?? undefined;
  return {
    username: HOUSE_USERNAME,
    tx_no: tx,
    txNo: tx,
  } as unknown as T;
}

/** react-router useSearchParams() -> [ReadonlyURLSearchParams] tuple shape */
export function useSearchParamsCompat() {
  return useSearchParams();
}

/** react-router <Link to=...> -> next/link <Link href=...> */
export function Link({
  to,
  children,
  ...rest
}: { to: string; children?: ReactNode } & Omit<ComponentProps<typeof NextLink>, "href">) {
  return (
    <NextLink href={to} {...rest}>
      {children}
    </NextLink>
  );
}
