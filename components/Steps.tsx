"use client";

import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { SendHorizontal, Zap, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { useInView } from "../hooks/useInView";

/* ── Each step is shown for this many ms ── */
const STEP_DURATION = 3500;

/* ── Progress bar sweeps left → right over STEP_DURATION ── */
const sweep = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

/* ── Number counts up with a slight bounce ── */
const popIn = keyframes`
  0%   { opacity: 0; transform: translateY(6px) scale(0.88); }
  60%  { transform: translateY(-2px) scale(1.04); }
  100% { opacity: 1; transform: none; }
`;

const iconFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
`;

/* ─────────────────────────────────────────────── */

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

/* ── Grid: reveal on scroll, click/auto cycles active step ── */
const StepsGrid = styled.div<{ $inView: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }

  /* Scroll-reveal stagger */
  & > * {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity  0.68s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.68s cubic-bezier(0.22, 1, 0.36, 1);
  }

  ${(p) => p.$inView && css`
    & > *:nth-child(1) { opacity: 1; transform: none; transition-delay:   0ms; }
    & > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 120ms; }
    & > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 240ms; }
  `}

  @media (prefers-reduced-motion: reduce) {
    & > * { transition: opacity 0.3s ease; transform: none !important; }
  }
`;

/* ── Individual step card ── */
const StepCard = styled.div<{ $active: boolean }>`
  position: relative;
  padding: 32px 28px 36px;
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

  /* Left lime accent strip */
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

/* ── Step number: small+muted when inactive, bold+dark when active ── */
const StepNum = styled.div<{ $active: boolean }>`
  font-family: var(--serif);
  font-style: italic;
  transition: font-size 0.35s ease, color 0.35s ease, margin-bottom 0.35s ease;

  font-size:     ${(p) => p.$active ? "52px"          : "15px"};
  color:         ${(p) => p.$active ? "var(--ink)"     : "var(--ink-mute)"};
  line-height:   ${(p) => p.$active ? "1"              : "1"};
  margin-bottom: ${(p) => p.$active ? "16px"           : "20px"};
  font-weight:   400;

  ${(p) => p.$active && css`
    animation: ${popIn} 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  `}
`;

/* ── Icon shown only when step is active ── */
const StepIcon = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--on-accent);
  display: grid;
  place-items: center;
  margin-bottom: 14px;
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
  margin: 0 0 10px;
  line-height: 1.15;
  transition: font-size 0.35s ease, color 0.35s ease;
  font-size: ${(p) => p.$active ? "24px" : "22px"};
  color:     ${(p) => p.$active ? "var(--ink)" : "var(--ink-soft)"};
`;

const StepP = styled.p`
  color: var(--ink-soft);
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
`;

/* ── Progress bar: fills from left over STEP_DURATION ── */
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

/* ── Dot indicators below the grid ── */
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

/* ─────────────────────────────────────────────── */

const steps = [
  {
    num: "01",
    icon: SendHorizontal,
    title: "Enter amount and destination",
    description: "Tell dexRL where the money's going and how much. We show you the fee and exactly what arrives — before you confirm anything.",
  },
  {
    num: "02",
    icon: Zap,
    title: "We route it",
    description: "Our router finds the cheapest path through on-chain liquidity and executes automatically. You just confirm the price.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "It lands in their account",
    description: "The recipient gets local currency in their bank. No wallet on their end, no stablecoin to convert, no explaining what just happened.",
  },
];

export function Steps() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(0);
  const [tick, setTick]     = useState(0); // remounts ProgressFill to reset animation

  /* Auto-cycle */
  useEffect(() => {
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % steps.length);
      setTick((k) => k + 1);
    }, STEP_DURATION);
    return () => clearTimeout(t);
  }, [active]);

  /* Jump to a step on click */
  const goTo = (idx: number) => {
    setActive(idx);
    setTick((k) => k + 1);
  };

  return (
    <StepsSection id="how" ref={ref as React.RefObject<HTMLElement>}>
      <Wrap>
        <StepsHead>
          <Reveal delay={0}><SectionEyebrow>How it works</SectionEyebrow></Reveal>
          <Reveal delay={90}><H2>Three steps. <em>That&apos;s it.</em></H2></Reveal>
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
                {/* Large step number */}
                <StepNum $active={isActive}>{s.num}</StepNum>

                {/* Icon — visible only when active */}
                <StepIcon $active={isActive} aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </StepIcon>

                <StepH3 $active={isActive}>{s.title}</StepH3>
                <StepP>{s.description}</StepP>

                {/* Progress bar — key={tick} resets animation on step change */}
                {isActive && (
                  <ProgressTrack>
                    <ProgressFill key={tick} />
                  </ProgressTrack>
                )}
              </StepCard>
            );
          })}
        </StepsGrid>

        {/* Dot indicators */}
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
