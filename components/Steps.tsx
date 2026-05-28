"use client";

import styled from "styled-components";

const StepsSection = styled.section``;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 720px) {
    padding: 0 20px;
  }
`;

const StepsHead = styled.div`
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
  }
`;

const Sub = styled.p`
  font-size: 18px;
  color: var(--ink-soft);
  max-width: 60ch;
  line-height: 1.55;
  text-wrap: pretty;
  margin: 0;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.div`
  padding: 40px 28px 44px;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 820px) {
    border-right: none;
    border-bottom: 1px solid var(--line);

    &:last-child {
      border-bottom: none;
    }
  }
`;

const StepNum = styled.div`
  font-family: var(--serif);
  font-size: 16px;
  font-style: italic;
  color: var(--accent);
  margin-bottom: 8px;
`;

const StepH3 = styled.h3`
  font-family: var(--serif);
  font-weight: 400;
  font-size: 26px;
  letter-spacing: -0.015em;
  margin: 0;
  line-height: 1.15;
  color: var(--ink);
`;

const StepP = styled.p`
  color: var(--ink-soft);
  margin: 0;
  font-size: 16px;
`;

const steps = [
  {
    num: "01",
    title: "One-click settlement",
    description: "Select the settlement on digital asset you wish to create",
  },
  {
    num: "02",
    title: "Exact fills the route",
    description: "Exact consolidates the entire through available routing infrastructure",
  },
  {
    num: "03",
    title: "Send directly to your wallet",
    description: "The arrival node executes the settlement instantly at the route only by your wallet",
  },
];

export function Steps() {
  return (
    <StepsSection id="how">
      <Wrap>
        <StepsHead>
          <SectionEyebrow>How it works</SectionEyebrow>
          <H2>
            Three steps. <em>That&apos;s it.</em>
          </H2>
          <Sub>
            A guided settlement flow designed for financial teams and operations — not traders.
          </Sub>
        </StepsHead>
        <StepsGrid>
          {steps.map((step) => (
            <Step key={step.num}>
              <StepNum>{step.num}</StepNum>
              <StepH3>{step.title}</StepH3>
              <StepP>{step.description}</StepP>
            </Step>
          ))}
        </StepsGrid>
      </Wrap>
    </StepsSection>
  );
}
