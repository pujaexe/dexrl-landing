"use client";

import React from "react";
import styled, { css } from "styled-components";
import { FileKey2, Key, XCircle } from "lucide-react";
import { Reveal } from "./Reveal";
import { useInView } from "../hooks/useInView";

const SecuritySection = styled.section``;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 720px) {
    padding: 0 20px;
  }
`;

const SecHead = styled.div`
  max-width: 760px;
  margin: 0 0 56px;
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
  margin: 0;
  text-wrap: balance;

  em { font-style: italic; color: var(--accent-em); }
`;

const SecCardsGrid = styled.div<{ $inView: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }

  & > * {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity  0.68s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.68s cubic-bezier(0.22, 1, 0.36, 1);
  }

  ${(p) => p.$inView && css`
    & > *:nth-child(1) { opacity: 1; transform: none; transition-delay:   0ms; }
    & > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 130ms; }
    & > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 260ms; }
  `}

  @media (prefers-reduced-motion: reduce) {
    & > * { transition: opacity 0.3s ease; transform: none !important; }
  }
`;

const SecCard = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SecIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: var(--accent-soft);
  color: var(--on-accent);
  display: grid;
  place-items: center;
  margin-bottom: 4px;
`;

const SecCardTitle = styled.h3`
  font-weight: 600;
  font-size: 17px;
  color: var(--ink);
  letter-spacing: -0.01em;
  margin: 0;
`;

const SecCardDesc = styled.p`
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.58;
  margin: 0;
`;

const ContrastBanner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid transparent;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ContrastLeft = styled.div`
  background: var(--bg-deep);
  padding: 28px 32px;

  @media (max-width: 720px) {
    padding: 24px;
  }
`;

const ContrastRight = styled.div`
  background: color-mix(in srgb, #CBF23D 12%, var(--bg-deep));
  padding: 28px 32px;

  @media (max-width: 720px) {
    padding: 24px;
    border-top: 1px solid rgba(203,242,61,0.15);
  }
`;

const ContrastLabel = styled.div<{ $accent?: boolean }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: ${(p) => p.$accent ? "#CBF23D" : "rgba(236,240,239,0.40)"};
  margin-bottom: 12px;
`;

const ContrastText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: rgba(236,240,239,0.82);
  margin: 0;
`;

const points = [
  {
    icon: FileKey2,
    title: "TEE key management",
    description: "Every private key is generated and used inside a hardware enclave. It never touches dexRL servers, databases, or staff.",
  },
  {
    icon: Key,
    title: "One-time scoped permission",
    description: "The user grants a bounded permission once: approved contracts only, with amount and time limits, enforced in hardware.",
  },
  {
    icon: XCircle,
    title: "Emergency stop",
    description: "A circuit breaker can revoke all automatic signing across every user in real time if unusual activity appears.",
  },
];

export function Security() {
  const { ref, inView } = useInView();
  return (
    <SecuritySection id="security" ref={ref as React.RefObject<HTMLElement>}>
      <Wrap>
        <SecHead>
          <Reveal delay={0}><SectionEyebrow>Self custody</SectionEyebrow></Reveal>
          <Reveal delay={90}>
            <H2>Even if the backend were breached, <em>the funds are unreachable.</em></H2>
          </Reveal>
        </SecHead>

        <SecCardsGrid $inView={inView}>
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <SecCard key={point.title}>
                <SecIconWrap><Icon size={20} strokeWidth={1.8} /></SecIconWrap>
                <SecCardTitle>{point.title}</SecCardTitle>
                <SecCardDesc>{point.description}</SecCardDesc>
              </SecCard>
            );
          })}
        </SecCardsGrid>

        <Reveal delay={360}>
          <ContrastBanner>
            <ContrastLeft>
              <ContrastLabel>The custodial risk</ContrastLabel>
              <ContrastText>
                Any provider that holds user funds becomes a single point of failure. Insolvency, a regulatory freeze, or an operational halt — and the funds go with the provider.
              </ContrastText>
            </ContrastLeft>
            <ContrastRight>
              <ContrastLabel $accent>The dexRL difference</ContrastLabel>
              <ContrastText>
                Funds move from the user&apos;s own wallet to the recipient. There is no pool to seize, freeze, or lose. This protects partners from counterparty and reputational risk too.
              </ContrastText>
            </ContrastRight>
          </ContrastBanner>
        </Reveal>
      </Wrap>
    </SecuritySection>
  );
}
