"use client";

import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { LogIn, Coins, MapPin, CheckCircle2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { useInView } from "../hooks/useInView";

const STEP_DURATION = 3500;

const sweep = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

const popIn = keyframes`
  0%   { opacity: 0; transform: translateY(6px) scale(0.88); }
  60%  { transform: translateY(-2px) scale(1.04); }
  100% { opacity: 1; transform: none; }
`;

const iconFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
`;

const StepsSection = styled.section``;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  @media (max-width: 720px) { padding: 0 20px; }
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

const StepsGrid = styled.div<{ $inView: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
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
    & > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 100ms; }
    & > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 200ms; }
    & > *:nth-child(4) { opacity: 1; transform: none; transition-delay: 300ms; }
  `}

  @media (prefers-reduced-motion: reduce) {
    & > * { transition: opacity 0.3s ease; transform: none !important; }
  }
`;

const StepCard = styled.div<{ $active: boolean }>`
  position: relative;
  padding: 28px 24px 32px;
  border-radius: var(--radius);
  cursor: pointer;
  overflow: hidden;
  transition:
    background    0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow    0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform     0.3s ease;

  background: ${(p) => p.$active ? "var(--bg-elev)" : "transparent"};
  box-shadow: ${(p) => p.$active ? "var(--shadow-2)" : "none"};
  transform: ${(p) => p.$active ? "translateY(-4px)" : "none"};
  border: 1px solid ${(p) => p.$active ? "var(--line)" : "transparent"};

  &::before {
    content: '';
    position: absolute;
    top: 16px;
    bottom: 16px;
    left: 0;
    width: 3px;
    background: var(--accent);
    border-radius: 0 2px 2px 0;
    transition: opacity 0.3s ease, transform 0.35s ease;
    transform-origin: left;
    transform: scaleX(${(p) => p.$active ? 1 : 0});
    opacity: ${(p) => p.$active ? 1 : 0};
  }

  &:hover {
    background: ${(p) => p.$active ? "var(--bg-elev)" : "color-mix(in srgb, var(--bg-elev) 60%, transparent)"};
  }
`;

const StepNum = styled.div<{ $active: boolean }>`
  font-family: var(--serif);
  font-style: italic;
  transition: font-size 0.35s ease, color 0.35s ease, margin-bottom 0.35s ease;
  font-size:     ${(p) => p.$active ? "48px" : "15px"};
  color:         ${(p) => p.$active ? "var(--ink)" : "var(--ink-mute)"};
  line-height:   1;
  margin-bottom: ${(p) => p.$active ? "14px" : "18px"};
  font-weight:   400;

  ${(p) => p.$active && css`
    animation: ${popIn} 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  `}
`;

const StepIcon = styled.div<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--on-accent);
  display: grid;
  place-items: center;
  margin-bottom: 12px;
  transition: opacity 0.35s ease, transform 0.35s ease;
  opacity: ${(p) => p.$active ? 1 : 0};
  transform: ${(p) => p.$active ? "none" : "scale(0.7) translateY(8px)"};

  ${(p) => p.$active && css`
    svg { animation: ${iconFloat} 2.2s ease-in-out infinite; }
  `}
`;

const StepH3 = styled.h3<{ $active: boolean }>`
  font-family: var(--serif);
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 0 0 8px;
  line-height: 1.15;
  transition: font-size 0.35s ease, color 0.35s ease;
  font-size: ${(p) => p.$active ? "21px" : "19px"};
  color:     ${(p) => p.$active ? "var(--ink)" : "var(--ink-soft)"};
`;

const StepP = styled.p`
  color: var(--ink-soft);
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
`;

const ProgressTrack = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--line-soft);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--accent);
  transform-origin: left;
  animation: ${sweep} ${STEP_DURATION}ms linear forwards;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: ${(p) => p.$active ? "24px" : "8px"};
  height: 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: width 0.35s ease, background 0.25s ease;
  background: ${(p) => p.$active ? "var(--accent)" : "var(--line)"};
  padding: 0;
`;

const steps = [
  {
    num: "01",
    icon: LogIn,
    title: "Sign in",
    description: "Use your email or wallet to start.",
  },
  {
    num: "02",
    icon: Coins,
    title: "Choose what to send",
    description: "Select the stablecoin or digital asset you want to swap.",
  },
  {
    num: "03",
    icon: MapPin,
    title: "Enter the recipient",
    description: "Add where the funds should be received.",
  },
  {
    num: "04",
    icon: CheckCircle2,
    title: "Review and swap",
    description: "Confirm the details. dexRL helps route and complete the settlement.",
  },
];

export function Steps() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(0);
  const [tick, setTick]     = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % steps.length);
      setTick((k) => k + 1);
    }, STEP_DURATION);
    return () => clearTimeout(t);
  }, [active]);

  const goTo = (idx: number) => {
    setActive(idx);
    setTick((k) => k + 1);
  };

  return (
    <StepsSection id="how" ref={ref as React.RefObject<HTMLElement>}>
      <Wrap>
        <StepsHead>
          <Reveal delay={0}><SectionEyebrow>How it works</SectionEyebrow></Reveal>
          <Reveal delay={90}><H2>Four steps. <em>That&apos;s it.</em></H2></Reveal>
          <Reveal delay={170}>
            <Sub>No crypto knowledge needed. Works like a bank transfer — just faster and cheaper.</Sub>
          </Reveal>
        </StepsHead>

        <StepsGrid $inView={inView}>
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = active === idx;
            return (
              <StepCard
                key={s.num}
                $active={isActive}
                onClick={() => goTo(idx)}
                role="button"
                aria-label={`Step ${s.num}: ${s.title}`}
                aria-pressed={isActive}
              >
                <StepNum $active={isActive}>{s.num}</StepNum>
                <StepIcon $active={isActive} aria-hidden="true">
                  <Icon size={18} strokeWidth={1.8} />
                </StepIcon>
                <StepH3 $active={isActive}>{s.title}</StepH3>
                <StepP>{s.description}</StepP>
                {isActive && (
                  <ProgressTrack>
                    <ProgressFill key={tick} />
                  </ProgressTrack>
                )}
              </StepCard>
            );
          })}
        </StepsGrid>

        <Dots role="tablist" aria-label="Step indicators">
          {steps.map((s, idx) => (
            <Dot
              key={s.num}
              $active={active === idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to step ${s.num}`}
              role="tab"
              aria-selected={active === idx}
            />
          ))}
        </Dots>
      </Wrap>
    </StepsSection>
  );
}
