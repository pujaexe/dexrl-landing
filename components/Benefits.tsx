"use client";

import styled from "styled-components";

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

const BCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
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
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: oklch(82% 0.012 75);
    box-shadow: var(--shadow-2);
    transform: translateY(-2px);
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
  {
    num: "01",
    title: "Simple swaps",
    description: "Move between stablecoins and digital assets through a clean, guided flow",
  },
  {
    num: "02",
    title: "Business-ready",
    description: "Use it through a licensed swap arrangement, embed custom interface, or operate integration",
  },
  {
    num: "03",
    title: "Users stay in control",
    description: "Each user withdraws settlement instructions, stay connected through secure wallet access",
  },
];

export function Benefits() {
  return (
    <BenefitsSection id="benefits">
      <Wrap>
        <SectionHead>
          <SectionEyebrow>What it is</SectionEyebrow>
          <H2>
            Built for <em>simple</em> business settlement.
          </H2>
        </SectionHead>
        <BCardsGrid>
          {benefits.map((benefit) => (
            <BCard key={benefit.num}>
              <CardNum>{benefit.num}</CardNum>
              <CardH3>{benefit.title}</CardH3>
              <CardP>{benefit.description}</CardP>
            </BCard>
          ))}
        </BCardsGrid>
      </Wrap>
    </BenefitsSection>
  );
}
