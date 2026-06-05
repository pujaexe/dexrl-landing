"use client";

import styled, { keyframes } from "styled-components";
import { User, ArrowLeftRight, ChevronDown, Lock } from "lucide-react";

/* ── Entrance animation ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: none; }
`;

/* ── Film grain shift — steps(1) = jump-cut, not interpolated ── */
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

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* ─────────────────────────────────────────────────────
   Hero section — organic mesh gradient + grain overlay
   ───────────────────────────────────────────────────── */
const HeroSection = styled.section`
  padding: 80px 0 96px;
  position: relative;
  overflow: hidden;
  isolation: isolate;

  background:
    radial-gradient(ellipse 62% 68% at 14% 68%, rgba(203, 242, 61, 0.50) 0%, transparent 62%),
    radial-gradient(ellipse 48% 42% at -4% 4%,  rgba(236, 240, 239, 0.20) 0%, transparent 55%),
    radial-gradient(ellipse 38% 38% at 38% 96%, rgba(203, 242, 61, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse 58% 62% at 44% 2%,  rgba(0, 88, 64, 0.68) 0%, transparent 65%),
    radial-gradient(ellipse 62% 68% at 92% 28%, rgba(0, 33, 22, 0.92) 0%, transparent 65%),
    radial-gradient(ellipse 50% 50% at 58% 100%, rgba(0, 62, 44, 0.58) 0%, transparent 62%),
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

  @media (max-width: 720px) {
    padding: 0 20px;
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const HeroContent = styled.div``;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(203, 242, 61, 0.72);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 18px;

  &::before {
    content: "•";
    color: #CBF23D;
  }
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

  em {
    font-style: italic;
    color: #CBF23D;
  }
`;

const Lede = styled.p`
  font-size: 19px;
  color: rgba(236, 240, 239, 0.78);
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

const Button = styled.button<{ variant?: "ghost" }>`
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

  ${(props) =>
    props.variant === "ghost"
      ? `
    background: transparent;
    color: rgba(236, 240, 239, 0.90);
    border-color: rgba(255, 255, 255, 0.28);
    &:hover {
      border-color: rgba(255, 255, 255, 0.65);
      background: rgba(255, 255, 255, 0.07);
    }
  `
      : `
    background: #CBF23D;
    color: #003E2C;
    font-weight: 600;
    box-shadow: 0 0 28px rgba(203, 242, 61, 0.38);
    &:hover {
      background: #b8d934;
      transform: translateY(-1px);
      box-shadow: 0 0 40px rgba(203, 242, 61, 0.52);
    }
  `}
`;

const HeroTrust = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  color: rgba(236, 240, 239, 0.48);
  font-size: 13px;
  flex-wrap: wrap;
  letter-spacing: 0.01em;

  span {
    display: flex;
    align-items: center;
    gap: 7px;

    &::before {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(203, 242, 61, 0.50);
      flex-shrink: 0;
    }

    &:first-child::before { display: none; }
  }
`;

/* ═══════════════════════════════════════════
   SWAP BOX — matches product prototype
   ═══════════════════════════════════════════ */

const SwapBox = styled.div`
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 20px;
  padding: 22px;
  box-shadow:
    0 0  0 1px rgba(0, 33, 22, 0.06),
    0 8px 32px -8px rgba(0, 20, 10, 0.40),
    0 32px 80px -16px rgba(0, 14, 7, 0.60);
  position: relative;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;

/* Header row: "Swap" + profile icon */
const SwapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const SwapTitle = styled.h3`
  font-family: var(--serif);
  font-size: 21px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0;
`;

const ProfileBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--ink);
  color: #ECF0EF;
  display: grid;
  place-items: center;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: var(--bg-deep);
  }
`;

/* Token selector row: From [⇄] To */
const TokenRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 32px 1fr;
  gap: 6px;
  align-items: end;
  margin-bottom: 14px;
`;

const TokenSelectWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FieldLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: var(--ink-mute);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const TokenSelectBox = styled.div`
  background: var(--bg);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  padding: 10px 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: var(--line);
  }
`;

const TokenIcon = styled.div<{ $bg: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
`;

const TokenMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const TokenNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink);
  line-height: 1.2;
`;

const TokenSubtext = styled.div<{ $accent?: boolean }>`
  font-size: 10px;
  color: ${(p) => (p.$accent ? "var(--ink-soft)" : "var(--ink-mute)")};
  margin-top: 1px;
  line-height: 1;
`;

const ExchangeBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  color: var(--ink-soft);
  cursor: pointer;
  margin-bottom: 1px;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  flex-shrink: 0;

  &:hover {
    border-color: var(--accent);
    color: var(--ink);
    background: var(--accent-soft);
  }
`;

/* Send amount field */
const SendWrap = styled.div`
  margin-bottom: 10px;
`;

const AmountField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  margin-top: 5px;
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: var(--line);
  }
`;

const TokenIconSm = styled.div<{ $bg: string }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
`;

const AmountInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--serif);
  font-size: 26px;
  color: var(--ink-mute);
  letter-spacing: -0.02em;
  min-width: 0;

  &::placeholder {
    color: var(--line);
  }
`;

/* Destination address field */
const AddressWrap = styled.div`
  margin-bottom: 4px;
`;

const AddressInput = styled.input`
  display: block;
  width: 100%;
  margin-top: 5px;
  background: var(--bg);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &::placeholder {
    color: var(--ink-mute);
    font-size: 13px;
  }

  &:focus {
    border-color: var(--line);
  }
`;

/* Meta summary */
const SwapMeta = styled.div`
  border-top: 1px solid var(--line-soft);
  margin-top: 12px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MetaLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetaKey = styled.span`
  font-size: 12px;
  color: var(--ink-mute);
`;

const MetaVal = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-soft);
`;

/* Connect Account CTA */
const ConnectBtn = styled.button`
  width: 100%;
  margin-top: 14px;
  padding: 15px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--on-accent);
  border: none;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.005em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 20px rgba(203, 242, 61, 0.28);

  &:hover {
    background: #b8d934;
    transform: translateY(-1px);
    box-shadow: 0 0 32px rgba(203, 242, 61, 0.45);
  }
`;

/* ═══════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════ */
export function Hero() {
  return (
    <HeroSection>
      <Wrap>
        <HeroGrid>
          {/* ── Left: copy ── */}
          <HeroContent>
            <FadeUp $delay={0}><Eyebrow>FOR MODERN BUSINESSES</Eyebrow></FadeUp>
            <FadeUp $delay={90}>
              <H1>Global crypto settlement, <em>made simple.</em></H1>
            </FadeUp>
            <FadeUp $delay={180}>
              <Lede>
                Dexrl helps businesses move between stablecoins and digital assets
                through a guided swap experience. No trading screens. No Web3 confusion.
                Just simple settlement flows for modern businesses.
              </Lede>
            </FadeUp>
            <FadeUp $delay={260}>
              <HeroCTAs>
                <Button>Swap Now →</Button>
                <Button variant="ghost">Talk to our team</Button>
              </HeroCTAs>
            </FadeUp>
            <FadeUp $delay={340}>
              <HeroTrust>
                <span>Non-custodial by design</span>
                <span>Stablecoin rails across Asia</span>
                <span>Settles in minutes</span>
              </HeroTrust>
            </FadeUp>
          </HeroContent>

          {/* ── Right: Swap widget ── */}
          <FadeUp $delay={140}>
            <SwapBox>

              {/* Header */}
              <SwapHeader>
                <SwapTitle>Swap</SwapTitle>
                <ProfileBtn aria-label="Account"><User size={15} /></ProfileBtn>
              </SwapHeader>

              {/* From / To token selectors */}
              <TokenRow>
                {/* From */}
                <TokenSelectWrap>
                  <FieldLabel>From</FieldLabel>
                  <TokenSelectBox>
                    <TokenIcon $bg="#1A56DB">X</TokenIcon>
                    <TokenMeta>
                      <TokenNameRow>
                        IDRX <ChevronDown size={11} />
                      </TokenNameRow>
                      <TokenSubtext>1 IDRX ≈ 1 IDR</TokenSubtext>
                    </TokenMeta>
                  </TokenSelectBox>
                </TokenSelectWrap>

                {/* Exchange button */}
                <ExchangeBtn aria-label="Swap tokens">
                  <ArrowLeftRight size={13} />
                </ExchangeBtn>

                {/* To */}
                <TokenSelectWrap>
                  <FieldLabel>To</FieldLabel>
                  <TokenSelectBox>
                    <TokenIcon $bg="#26A17B">₮</TokenIcon>
                    <TokenMeta>
                      <TokenNameRow>
                        USDT <ChevronDown size={11} />
                      </TokenNameRow>
                      <TokenSubtext $accent>On Polygon</TokenSubtext>
                    </TokenMeta>
                  </TokenSelectBox>
                </TokenSelectWrap>
              </TokenRow>

              {/* Send amount */}
              <SendWrap>
                <FieldLabel>Send</FieldLabel>
                <AmountField>
                  <TokenIconSm $bg="#1A56DB">X</TokenIconSm>
                  <AmountInput type="number" placeholder="0.00" min="0" />
                </AmountField>
              </SendWrap>

              {/* Destination Address */}
              <AddressWrap>
                <FieldLabel>Destination Address</FieldLabel>
                <AddressInput
                  type="text"
                  placeholder="Input wallet address"
                  autoComplete="off"
                  spellCheck={false}
                />
              </AddressWrap>

              {/* Quote summary */}
              <SwapMeta>
                <MetaLine>
                  <MetaKey>Minimum Received</MetaKey>
                  <MetaVal>0 USDT</MetaVal>
                </MetaLine>
                <MetaLine>
                  <MetaKey>Quote valid for</MetaKey>
                  <MetaVal>—</MetaVal>
                </MetaLine>
              </SwapMeta>

              {/* CTA */}
              <ConnectBtn>
                <Lock size={15} />
                Connect Account
              </ConnectBtn>

            </SwapBox>
          </FadeUp>
        </HeroGrid>
      </Wrap>
    </HeroSection>
  );
}
