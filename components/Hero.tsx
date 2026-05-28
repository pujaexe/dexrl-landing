"use client";

import styled from "styled-components";

const HeroSection = styled.section`
  padding: 80px 0 96px;
  position: relative;
  overflow: hidden;
`;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;

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
  color: var(--ink-soft);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 18px;

  &::before {
    content: "•";
    color: var(--accent);
  }
`;

const H1 = styled.h1`
  font-family: var(--serif);
  font-size: clamp(48px, 6.4vw, 84px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 18px 0 24px;
  color: var(--ink);
  text-wrap: balance;
  font-weight: 400;

  em {
    font-style: italic;
    color: oklch(35% 0.04 200);
  }
`;

const Lede = styled.p`
  font-size: 19px;
  color: var(--ink-soft);
  max-width: 52ch;
  text-wrap: pretty;
  line-height: 1.55;
  margin: 0;
`;

const HeroCTAs = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 36px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: "primary" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
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
    color: var(--ink);
    border-color: var(--line);

    &:hover {
      border-color: var(--ink);
      background: var(--bg-elev);
    }
  `
      : `
    background: var(--ink);
    color: var(--bg);
    box-shadow: var(--shadow-1);

    &:hover {
      background: oklch(28% 0.012 220);
      transform: translateY(-1px);
      box-shadow: var(--shadow-2);
    }
  `}
`;

const HeroTrust = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 40px;
  color: var(--ink-mute);
  font-size: 13px;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const SwapBox = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 22px;
  box-shadow: var(--shadow-2);
  position: relative;
`;

const SwapHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 16px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
`;

const SwapTitle = styled.div`
  font-family: var(--serif);
  font-size: 19px;
  letter-spacing: -0.01em;
  color: var(--ink);
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ink-mute);
  letter-spacing: 0.04em;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: oklch(62% 0.12 145);
    box-shadow: 0 0 0 4px oklch(62% 0.12 145 / 0.18);
    animation: pulse 2s ease-in-out infinite;
  }
`;

const SwapField = styled.div`
  background: var(--bg);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 18px;
  align-items: center;
  margin-bottom: 8px;
`;

const SwapLabel = styled.div`
  grid-column: 1 / -1;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 4px;
`;

const SwapAmount = styled.div`
  font-family: var(--serif);
  font-size: 30px;
  letter-spacing: -0.02em;
  color: var(--ink);
  line-height: 1.1;
`;

const TokenBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 14px 6px 6px;
  font-weight: 500;
  font-size: 14px;
  color: var(--ink);
`;

const TokenFlag = styled.div<{ $bgColor?: string }>`
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${(props) => props.$bgColor || "var(--accent)"};
  color: var(--bg);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.02em;
  flex-shrink: 0;
`;

const SwapDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -4px 0;
  position: relative;
  z-index: 2;
`;

const SwapArrow = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--bg-elev);
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  color: var(--ink-soft);
  margin: -16px 0;
  box-shadow: 0 4px 12px -4px rgba(20, 18, 14, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;

  &:hover {
    color: var(--ink);
    border-color: var(--accent);
  }
`;

const CountryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
`;

const CountryField = styled.div`
  background: var(--bg);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CountryLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-mute);
`;

const CountryName = styled.div`
  font-family: var(--serif);
  font-size: 16px;
  color: var(--ink);
  letter-spacing: -0.01em;
`;

const SwapMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  font-size: 13px;
  color: var(--ink-soft);
  border-top: 1px solid var(--line-soft);
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MetaLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-mute);
`;

const MetaValue = styled.div`
  color: var(--ink);
  font-weight: 500;
`;

const SwapCTA = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 16px;
  border-radius: 14px;
  background: var(--ink);
  color: var(--bg);
  border: none;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s ease, transform 0.15s ease;
  cursor: pointer;

  &:hover {
    background: oklch(28% 0.012 220);
    transform: translateY(-1px);
  }
`;

export function Hero() {
  return (
    <HeroSection>
      <Wrap>
        <HeroGrid>
          <HeroContent>
            <Eyebrow>FOR MODERN BUSINESSES</Eyebrow>
            <H1>
              Global crypto settlement, <em>made simple.</em>
            </H1>
            <Lede>
              Dexrl helps businesses move between stablecoins and digital assets
              through a guided swap experience. No trading screens. No Web3 confusion.
              Just simple settlement flows for modern businesses.
            </Lede>
            <HeroCTAs>
              <Button>Swap Now →</Button>
              <Button variant="ghost">Talk to our team</Button>
            </HeroCTAs>
            <HeroTrust>
              <span>Non-custodial by design</span>
              <span>Stablecoin rails across Asia</span>
              <span>Settles in minutes</span>
            </HeroTrust>
          </HeroContent>

          <SwapBox>
            <SwapHead>
              <SwapTitle>Business settlement</SwapTitle>
              <LiveBadge>LIVE ROUTE</LiveBadge>
            </SwapHead>

            <SwapField>
              <SwapLabel>You send</SwapLabel>
              <SwapAmount>125,000.00</SwapAmount>
              <TokenBadge>
                <TokenFlag $bgColor="oklch(42% 0.06 200)">₹</TokenFlag>
                IDR Stablecoin
              </TokenBadge>
            </SwapField>

            <SwapDivider>
              <SwapArrow>↕</SwapArrow>
            </SwapDivider>

            <SwapField>
              <SwapLabel>Recipient receives</SwapLabel>
              <SwapAmount>7,812.50</SwapAmount>
              <TokenBadge>
                <TokenFlag $bgColor="oklch(45% 0.08 210)">$</TokenFlag>
                USDC
              </TokenBadge>
            </SwapField>

            <CountryGrid>
              <CountryField>
                <CountryLabel>From country</CountryLabel>
                <CountryName>Indonesia</CountryName>
              </CountryField>
              <CountryField>
                <CountryLabel>To country</CountryLabel>
                <CountryName>Singapore</CountryName>
              </CountryField>
            </CountryGrid>

            <SwapMeta>
              <MetaItem>
                <MetaLabel>Estimated time</MetaLabel>
                <MetaValue>Minutes</MetaValue>
              </MetaItem>
              <MetaItem style={{ textAlign: "right" }}>
                <MetaLabel>Reference rate</MetaLabel>
                <MetaValue>1 USDC = 16,000 IDR</MetaValue>
              </MetaItem>
            </SwapMeta>

            <SwapCTA>Swap to USDC</SwapCTA>
          </SwapBox>
        </HeroGrid>
      </Wrap>
    </HeroSection>
  );
}
