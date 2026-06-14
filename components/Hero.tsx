"use client";

import styled, { keyframes } from "styled-components";
import dynamic from "next/dynamic";

// Live swap widget — client-only (web3/wallet stack must not run on the server).
const SwapWidget = dynamic(() => import("@/components/trading/SwapWidget"), {
  ssr: false,
  loading: () => <WidgetLoading aria-busy="true" />,
});

const WidgetLoading = styled.div`
  min-height: 520px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

/* ── Entrance animation ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: none; }
`;

const grainShift = keyframes`
  0%   { transform: translate(0%,    0%); }
  12%  { transform: translate(-4%,  -9%); }
  24%  { transform: translate(-9%,   4%); }
  36%  { transform: translate(3%,  -14%); }
  48%  { transform: translate(-6%,  11%); }
  60%  { transform: translate(10%,  -3%); }
  72%  { transform: translate(-2%,   8%); }
  84%  { transform: translate(7%,   -7%); }
  100% { transform: translate(0%,    0%); }
`;

const FadeUp = styled.div<{ $delay?: number }>`
  animation: ${fadeUp} 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${(p) => p.$delay ?? 0}ms;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

/* ── Hero: organic mesh gradient + film grain ── */
const HeroSection = styled.section`
  padding: 152px 0 96px;  /* 80px content + 72px navbar height */
  position: relative;
  overflow: hidden;
  isolation: isolate;

  background:
    radial-gradient(ellipse 62% 68% at 14% 68%, rgba(203,242,61,0.50) 0%, transparent 62%),
    radial-gradient(ellipse 48% 42% at -4%  4%, rgba(236,240,239,0.20) 0%, transparent 55%),
    radial-gradient(ellipse 38% 38% at 38% 96%, rgba(203,242,61,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 58% 62% at 44%  2%, rgba(0,88,64,0.68)    0%, transparent 65%),
    radial-gradient(ellipse 62% 68% at 92% 28%, rgba(0,33,22,0.92)    0%, transparent 65%),
    radial-gradient(ellipse 50% 50% at 58% 100%,rgba(0,62,44,0.58)    0%, transparent 62%),
    #001B0E;

  &::before {
    content: '';
    position: absolute;
    inset: -55%;
    width: 210%;
    height: 210%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72 0.68' numOctaves='4' seed='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size: 220px 220px;
    opacity: 0.055;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 0;
    animation: ${grainShift} 0.65s steps(1) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before { animation: none; }
  }
`;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
  @media (max-width: 720px) { padding: 0 20px; }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;
  @media (max-width: 980px) { grid-template-columns: 1fr; gap: 48px; }
`;

const HeroContent = styled.div``;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(203,242,61,0.72);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 18px;
  &::before { content: "•"; color: #CBF23D; }
`;

const H1 = styled.h1`
  font-family: var(--serif);
  font-size: clamp(48px, 6.4vw, 84px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 18px 0 24px;
  color: #ECF0EF;
  text-wrap: balance;
  font-weight: 400;
  em { font-style: italic; color: #CBF23D; }
`;

const Lede = styled.p`
  font-size: 19px;
  color: rgba(236,240,239,0.78);
  max-width: 52ch;
  text-wrap: pretty;
  line-height: 1.58;
  margin: 0;
`;

const HeroCTAs = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 36px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 26px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.005em;
  border: 1px solid transparent;
  transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease,
    color 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;

  ${(props) => props.$variant === "ghost" ? `
    background: transparent;
    color: rgba(236,240,239,0.90);
    border-color: rgba(255,255,255,0.28);
    &:hover { border-color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.07); }
  ` : `
    background: #CBF23D;
    color: #003E2C;
    font-weight: 600;
    box-shadow: 0 0 28px rgba(203,242,61,0.38);
    &:hover { background: #b8d934; transform: translateY(-1px); box-shadow: 0 0 40px rgba(203,242,61,0.52); }
  `}
`;

const HeroTrust = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  color: rgba(236,240,239,0.48);
  font-size: 13px;
  flex-wrap: wrap;
  letter-spacing: 0.01em;

  span {
    display: flex;
    align-items: center;
    gap: 7px;
    &::before {
      content: '';
      width: 4px; height: 4px;
      border-radius: 50%;
      background: rgba(203,242,61,0.50);
      flex-shrink: 0;
    }
    &:first-child::before { display: none; }
  }
`;

/* ── Render ── */
export function Hero() {
  return (
    <HeroSection>
      <Wrap>
        <HeroGrid>

          {/* ── Left: marketing copy ── */}
          <HeroContent>
            <FadeUp $delay={0}><Eyebrow>The global self-custodial stablecoin hub</Eyebrow></FadeUp>
            <FadeUp $delay={90}>
              <H1>Move money across borders <em>in minutes.</em><br />The Future Rails for Global Liquidity</H1>
            </FadeUp>
            <FadeUp $delay={180}>
              <Lede>
                One hub connecting regulated issuers, on-chain liquidity, and licensed off-ramps. Faster and cheaper than banks — and your funds stay yours.
              </Lede>
            </FadeUp>
            <FadeUp $delay={260}>
              <HeroCTAs>
                <Button>Get a quote →</Button>
                <Button as="a" href="/contact" $variant="ghost">Talk to our team</Button>
              </HeroCTAs>
            </FadeUp>
            <FadeUp $delay={340}>
              <HeroTrust>
                <span>You own your wallet. Always.</span>
                <span>Stablecoin corridors across Asia.</span>
                <span>Settles before the bank opens.</span>
              </HeroTrust>
            </FadeUp>
          </HeroContent>

          {/* ── Right: Swap widget ── */}
          <FadeUp $delay={140}>
            <SwapWidget />
          </FadeUp>

        </HeroGrid>
      </Wrap>
    </HeroSection>
  );
}
