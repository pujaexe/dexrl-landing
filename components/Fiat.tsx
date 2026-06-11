"use client";

import React from "react";
import styled, { css } from "styled-components";
import { Reveal } from "./Reveal";
import { useInView } from "../hooks/useInView";

const FiatSection = styled.section`
  background: #E6EDEA;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  scroll-margin-top: 72px;
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

  em { font-style: italic; color: var(--accent-em); }
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

const ComplianceNote = styled.div`
  margin-top: 16px;
  grid-column: 1 / -1;
  padding: 14px 18px;
  background: var(--accent-soft);
  border: 1px solid var(--line);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.6;
`;

const partners = [
  { role: "Onramp partner", name: "Licensed stablecoin issuer", region: "Indonesia" },
  { role: "Delivery partner", name: "Regulated payment institution", region: "United Kingdom" },
  { role: "Delivery partner", name: "Regulated payment institution", region: "Singapore" },
  { role: "Wallet infrastructure", name: "Hardware-secured key vault", region: "Global" },
];

export function Fiat() {
  const { ref, inView } = useInView();
  return (
    <FiatSection id="partner" ref={ref as React.RefObject<HTMLElement>}>
      <Wrap>
        <FiatGrid>
          <div>
            <Reveal delay={0}><SectionEyebrow>Licensed partners</SectionEyebrow></Reveal>
            <Reveal delay={90}>
              <H2>We don&apos;t handle fiat. <em>They do.</em></H2>
            </Reveal>
            <Reveal delay={170}>
              <Sub>
                dexRL is a routing layer, not a money transmitter. Licensed partners at each end hold the regulated licences and handle KYC, AML, and fiat compliance in their markets.
              </Sub>
            </Reveal>
          </div>
          <div>
            <PartnersGrid $inView={inView}>
              {partners.map((p, idx) => (
                <Partner key={idx}>
                  <PartnerRole>{p.role}</PartnerRole>
                  <PartnerName>{p.name}</PartnerName>
                  <PartnerRegion>{p.region}</PartnerRegion>
                </Partner>
              ))}
            </PartnersGrid>
            <Reveal delay={400}>
              <ComplianceNote>
                dexRL is a routing layer, not a money transmitter. Licensed partners at each end hold the regulated licences and handle KYC, AML, and fiat compliance in their markets.
              </ComplianceNote>
            </Reveal>
          </div>
        </FiatGrid>
      </Wrap>
    </FiatSection>
  );
}
