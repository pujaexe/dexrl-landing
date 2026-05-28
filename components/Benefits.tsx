"use client";

import React from "react";
import styled, { css } from "styled-components";
import { Reveal } from "./Reveal";
import { useInView } from "../hooks/useInView";

const BenefitsSection = styled.section``;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 720px) {
    padding: 0 20px;
  }
`;

const SectionHead = styled.div`
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
  margin: 0 0 16px;
  text-wrap: balance;

  em {
    font-style: italic;
    color: oklch(35% 0.04 200);
  }
`;

const BCardsGrid = styled.div<{ $inView: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }

  & > * {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity  0.68s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.68s cubic-bezier(0.22, 1, 0.36, 1);
  }

  ${(p) =>
    p.$inView &&
    css`
      & > *:nth-child(1) { opacity: 1; transform: none; transition-delay:   0ms; }
      & > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 120ms; }
      & > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 240ms; }
    `}

  @media (prefers-reduced-motion: reduce) {
    & > * { transition: opacity 0.3s ease; transform: none !important; }
  }
`;

const BCard = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 240px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: oklch(82% 0.012 75);
    box-shadow: var(--shadow-2);
  }
`;

const CardNum = styled.div`
  font-family: var(--serif);
  font-style: italic;
  font-size: 18px;
  color: var(--ink-mute);
`;

const CardH3 = styled.h3`
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 4px 0 0;
  line-height: 1.1;
  color: var(--ink);
`;

const CardP = styled.p`
  color: var(--ink-soft);
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
`;

const benefits = [
  { num: "01", title: "Simple swaps",          description: "Move between stablecoins and digital assets through a clean, guided flow" },
  { num: "02", title: "Business-ready",         description: "Use it through a licensed swap arrangement, embed custom interface, or operate integration" },
  { num: "03", title: "Users stay in control",  description: "Each user withdraws settlement instructions, stay connected through secure wallet access" },
];

export function Benefits() {
  const { ref, inView } = useInView();
  return (
    <BenefitsSection id="benefits" ref={ref as React.RefObject<HTMLElement>}>
      <Wrap>
        <SectionHead>
          <Reveal delay={0}><SectionEyebrow>What it is</SectionEyebrow></Reveal>
          <Reveal delay={90}><H2>Built for <em>simple</em> business settlement.</H2></Reveal>
        </SectionHead>
        <BCardsGrid $inView={inView}>
          {benefits.map((b) => (
            <BCard key={b.num}>
              <CardNum>{b.num}</CardNum>
              <CardH3>{b.title}</CardH3>
              <CardP>{b.description}</CardP>
            </BCard>
          ))}
        </BCardsGrid>
      </Wrap>
    </BenefitsSection>
  );
}
