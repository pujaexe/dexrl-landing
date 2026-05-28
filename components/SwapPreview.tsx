"use client";

import styled from "styled-components";

const SwapContainer = styled.section`
  background: var(--bg);
  padding: 110px 0;

  @media (max-width: 820px) {
    padding: 72px 0;
  }
`;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  place-items: center;

  @media (max-width: 720px) {
    padding: 0 20px;
  }
`;

const SwapBox = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 22px 22px 22px;
  box-shadow: var(--shadow-2);
  position: relative;
  max-width: 440px;
  width: 100%;
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

const TokenFlag = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: var(--bg);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.02em;
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

  &:hover {
    color: var(--ink);
    border-color: var(--accent);
  }
`;

const SwapSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 6px 6px;
  font-size: 14px;
  color: var(--ink-soft);
  border-top: 1px solid var(--line-soft);
`;

const SummaryValue = styled.div`
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

export function SwapPreview() {
  return (
    <SwapContainer>
      <Wrap>
        <SwapBox>
          <SwapHead>
            <SwapTitle>Swap</SwapTitle>
            <LiveBadge>Live rates</LiveBadge>
          </SwapHead>

          <SwapField>
            <SwapLabel>You send</SwapLabel>
            <SwapAmount>1,000</SwapAmount>
            <TokenBadge>
              <TokenFlag>$</TokenFlag>
              USDC
            </TokenBadge>
          </SwapField>

          <SwapDivider>
            <SwapArrow>↔</SwapArrow>
          </SwapDivider>

          <SwapField>
            <SwapLabel>You receive</SwapLabel>
            <SwapAmount>995</SwapAmount>
            <TokenBadge>
              <TokenFlag>€</TokenFlag>
              USDE
            </TokenBadge>
          </SwapField>

          <SwapSummary>
            <span>Exchange rate</span>
            <SummaryValue>1 USDC = 0.995 USDE</SummaryValue>
          </SwapSummary>

          <SwapCTA>Execute Swap</SwapCTA>
        </SwapBox>
      </Wrap>
    </SwapContainer>
  );
}
