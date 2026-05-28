"use client";

import React from "react";
import styled, { css } from "styled-components";
import { Reveal } from "./Reveal";
import { useInView } from "../hooks/useInView";

const FiatSection = styled.section`
  background: oklch(96% 0.008 85);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
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

const FiatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const SectionEyebrow = styled.div`
  font-size: 13px;
  color: var(--ink-mute);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 18px;
  font-family: var(--sans);
  font-weight: 500;
`;

const H2 = styled.h2`
  font-family: var(--serif);
  font-size: clamp(36px, 4.4vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.022em;
  font-weight: 400;
  color: var(--ink);
  margin: 0 0 16px;
  text-wrap: balance;

  em { font-style: italic; }
`;

const Sub = styled.p`
  font-size: 18px;
  color: var(--ink-soft);
  max-width: 60ch;
  line-height: 1.55;
  text-wrap: pretty;
  margin: 0;
`;

const PartnersGrid = styled.div<{ $inView: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  & > * {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity  0.62s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.62s cubic-bezier(0.22, 1, 0.36, 1);
  }

  ${(p) =>
    p.$inView &&
    css`
      & > *:nth-child(1) { opacity: 1; transform: none; transition-delay:   0ms; }
      & > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 100ms; }
      & > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 200ms; }
      & > *:nth-child(4) { opacity: 1; transform: none; transition-delay: 300ms; }
    `}

  @media (prefers-reduced-motion: reduce) {
    & > * { transition: opacity 0.3s ease; transform: none !important; }
  }
`;

const Partner = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 110px;
`;

const PartnerRole = styled.div`
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-mute);
`;

const PartnerName = styled.div`
  font-family: var(--serif);
  font-size: 22px;
  letter-spacing: -0.01em;
  color: var(--ink);
`;

const PartnerRegion = styled.div`
  font-size: 13px;
  color: var(--ink-soft);
  margin-top: auto;
`;

const partners = [
  { role: "Partner provider",     name: "Binance fiat partner",       region: "Southeast Asia" },
  { role: "Settlement provider",  name: "Crypto settlement hub",      region: "Asia Pacific"   },
  { role: "License provider",     name: "Institutional liquidity call", region: "Singapore"    },
  { role: "Currency provider",    name: "Local settlement bank",      region: "Indonesia"      },
];

export function Fiat() {
  const { ref, inView } = useInView();
  return (
    <FiatSection ref={ref as React.RefObject<HTMLElement>}>
      <Wrap>
        <FiatGrid>
          <div>
            <Reveal delay={0}><SectionEyebrow>Fiat redemptions</SectionEyebrow></Reveal>
            <Reveal delay={90}>
              <H2>Fiat services, <em>when needed,</em> are handled by licensed providers.</H2>
            </Reveal>
            <Reveal delay={170}>
              <Sub>
                Dexrl supports stablecoin-based settlement flows. When fiat entry or exit is required, licensed fiat providers integrate into the settlement rails.
              </Sub>
            </Reveal>
          </div>
          <PartnersGrid $inView={inView}>
            {partners.map((p, idx) => (
              <Partner key={idx}>
                <PartnerRole>{p.role}</PartnerRole>
                <PartnerName>{p.name}</PartnerName>
                <PartnerRegion>{p.region}</PartnerRegion>
              </Partner>
            ))}
          </PartnersGrid>
        </FiatGrid>
      </Wrap>
    </FiatSection>
  );
}
