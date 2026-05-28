"use client";

import styled from "styled-components";

const FinalCTASection = styled.section`
  text-align: center;
  padding: 140px 0 160px;

  @media (max-width: 820px) {
    padding: 96px 0 110px;
  }
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

const H2 = styled.h2`
  font-family: var(--serif);
  font-size: clamp(44px, 5.6vw, 72px);
  line-height: 1.05;
  letter-spacing: -0.022em;
  font-weight: 400;
  color: var(--ink);
  margin: 0 0 18px;
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
  margin: 0 auto 36px;
`;

const CTAButtons = styled.div`
  display: inline-flex;
  gap: 12px;
  justify-content: center;
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

export function FinalCTA() {
  return (
    <FinalCTASection>
      <Wrap>
        <H2>
          Start with a simple <em>settlement flow.</em>
        </H2>
        <Sub>
          Use Dexrl to move between stablecoins and digital assets through a guided swap experience.
        </Sub>
        <CTAButtons>
          <Button>Swap Now</Button>
          <Button variant="ghost">Talk to our team</Button>
        </CTAButtons>
      </Wrap>
    </FinalCTASection>
  );
}
