import type { Metadata } from "next";
import "./globals.css";
import { StyledComponentsRegistry } from "@/lib/registry";

/* ─── Site constants ─────────────────────────────────────────── */
const SITE_URL  = "https://dexrl.com";
const SITE_NAME = "dexRL";

const TITLE       = "dexRL — Instant cross-border payments. Zero Web3 complexity.";
const DESCRIPTION =
  "dexRL enables instant cross-border stablecoin payments in under 10 minutes at a fraction of traditional bank fees. 100% self-custodial, compliant, and built for modern businesses operating across Southeast Asia and beyond.";

/* ─── Next.js Metadata (SEO + OG + Twitter Card) ─────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,

  /* ── Canonical & indexing ── */
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  /* ── Keywords (helps AI citation tools + older crawlers) ── */
  keywords: [
    "cross-border payments",
    "stablecoin payments",
    "IDRX",
    "USDT",
    "Indonesia to UK payments",
    "Southeast Asia remittance",
    "self-custodial stablecoin",
    "DeFi payments",
    "non-custodial payments",
    "instant international transfer",
    "stablecoin settlement",
    "dexRL",
    "web3 payments infrastructure",
  ],

  /* ── Authors / publisher (AI citation signals) ── */
  authors: [{ name: "dexRL", url: SITE_URL }],
  creator: "dexRL",
  publisher: "dexRL",

  /* ── Open Graph ── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",           // 1200×630, see public/og-image.png
        width: 1200,
        height: 630,
        alt: "dexRL — Instant cross-border payments on stablecoin rails",
      },
    ],
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@dexrl",
    site: "@dexrl",
  },

  /* ── Favicons (full favicon_io package) ── */
  icons: {
    icon: [
      { url: "/favicon.ico",        sizes: "any"   },
      { url: "/favicon-16x16.png",  sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png",  sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },

  /* ── App / PWA ── */
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
};

/* ─── JSON-LD Structured Data (AI citation + rich snippets) ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    /* Organisation entity */
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "dexRL",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
      },
      description: DESCRIPTION,
      foundingDate: "2026",
      areaServed: ["ID", "SG", "GB", "MY", "PH", "AE"],
      knowsAbout: [
        "Stablecoin payments",
        "Cross-border remittance",
        "DeFi infrastructure",
        "Self-custodial wallets",
        "IDRX",
        "USDT",
      ],
      sameAs: [
        "https://twitter.com/dexrl",
        "https://linkedin.com/company/dexrl",
      ],
    },

    /* WebSite entity */
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "dexRL",
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },

    /* WebPage / SoftwareApplication entity */
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#product`,
      name: "dexRL",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description:
        "A self-custodial cross-border payment rail that routes transfers through stablecoin infrastructure. Settles in under 10 minutes at 0.6–1.1% total fee. Supports Indonesia → UK, Indonesia → Singapore, and expanding SEA corridors.",
      provider: { "@id": `${SITE_URL}/#organization` },
      featureList: [
        "Self-custodial wallet (user owns keys via Privy TEE)",
        "Instant stablecoin settlement < 10 minutes",
        "IDRX onramp — licensed Indonesian stablecoin issuer",
        "Monerium delivery — FCA-authorised UK/EU fiat delivery",
        "StraitsX delivery — MAS-licensed SGD delivery",
        "0.6–1.1% total fee vs 2–6% via banks",
        "No crypto literacy required",
        "Non-custodial — dexRL never holds user funds",
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "0",
        description: "Free to connect. Fees apply per transaction (0.6–1.1%)",
      },
    },

    /* FAQ — common investor/partner questions (AI-friendly) */
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How does dexRL work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "dexRL routes cross-border payments through a three-step stablecoin pipeline: (1) Mint — local currency is converted into a regulated stablecoin (e.g. IDR → IDRX); (2) Swap — dexRL's router converts the source stablecoin to the target stablecoin on-chain; (3) Redeem — the target stablecoin is delivered to a licensed off-ramp partner who credits the recipient's bank account in local fiat. The entire flow settles in under 10 minutes.",
          },
        },
        {
          "@type": "Question",
          name: "Is dexRL custodial?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. dexRL is entirely non-custodial. User funds flow through cryptographic wallets held exclusively by the user, generated inside a Trusted Execution Environment (TEE) via Privy. dexRL never holds, controls, or has access to user funds at any point.",
          },
        },
        {
          "@type": "Question",
          name: "What payment corridors does dexRL support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Version 1 supports Indonesia → United Kingdom (IDRX/USDT/USDC onramp, Monerium tGBP → GBP delivery). Version 2 will add Indonesia → Singapore (StraitsX XSGD → SGD) and a universal Asia → UK fallback via USDT/USDC. Philippines → UAE is planned for Version 3.",
          },
        },
        {
          "@type": "Question",
          name: "What are dexRL's fees?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "dexRL charges a total fee of 0.6–1.1% per transaction, broken down as: 0.1–0.3% onramp fee, 0.2–0.5% swap fee (the primary revenue driver), and 0.1–0.3% delivery fee. This compares to 2–6% via traditional banks and wire services.",
          },
        },
        {
          "@type": "Question",
          name: "Who are dexRL's regulated partners?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "dexRL's regulated partner network includes: IDRX (licensed Indonesian stablecoin issuer, handles KYC/AML for IDR onramp), Monerium (FCA-authorised UK/EU EMI, handles GBP/EUR delivery), StraitsX (MAS-licensed Singapore payment firm, handles SGD delivery), and Privy (wallet infrastructure via TEE hardware vault).",
          },
        },
      ],
    },
  ],
};

/* ─── Root Layout ─────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data for search engines + AI citation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
