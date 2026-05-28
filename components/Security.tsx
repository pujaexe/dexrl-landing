"use client";

import React from "react";
import styled, { css } from "styled-components";
import { Lock, Key, CheckCircle2 } from "lucide-react";
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

const SecGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 80px;
  align-items: start;

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

const SecPoints = styled.div<{ $inView: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  & > * {
    opacity: 0;
    transform: translateX(20px);
    transition:
      opacity  0.65s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  }

  ${(p) =>
    p.$inView &&
    css`
      & > *:nth-child(1) { opacity: 1; transform: none; transition-delay:   0ms; }
      & > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 120ms; }
      & > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 240ms; }
      & > *:nth-child(4) { opacity: 1; transform: none; transition-delay: 360ms; }
    `}

  @media (prefers-reduced-motion: reduce) {
    & > * { transition: opacity 0.3s ease; transform: none !important; }
  }
`;

const SecPoint = styled.div`
  display: flex;
  gap: 18px;
  align-items: flex-start;
  padding: 22px 0;
  border-bottom: 1px solid var(--line-soft);

  &:last-child { border-bottom: none; }
`;

const SecIcon = styled.div`
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  display: grid;
  place-items: center;
`;

const SecText = styled.div`
  font-size: 17px;
  color: var(--ink);
  line-height: 1.45;
`;

const SecDisclaim = styled.div`
  margin-top: 28px;
  padding: 22px 24px;
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.55;
`;

const points = [
  { icon: Lock,         text: "Dedicated settlement wallet for each user" },
  { icon: Key,          text: "Passkey or email-based access" },
  { icon: CheckCircle2, text: "User-authorized settlement instructions" },
];

export function Security() {
  const { ref, inView } = useInView();
  return (
    <SecuritySection id="security" ref={ref as React.RefObject<HTMLElement>}>
      <Wrap>
        <SecGrid>
          <div>
            <Reveal delay={0}><SectionEyebrow>Security &amp; control</SectionEyebrow></Reveal>
            <Reveal delay={90}><H2>Designed so users <em>stay in control.</em></H2></Reveal>
            <Reveal delay={170}>
              <Sub>
                Dexrl is designed as a non-custodial setup and wallet access. Users authorized settlement instructions, and wallet access remains controlled through secure authentication.
              </Sub>
            </Reveal>
          </div>
          <SecPoints $inView={inView}>
            {points.map((point, idx) => {
              const Icon = point.icon;
              return (
                <SecPoint key={idx}>
                  <SecIcon><Icon size={20} /></SecIcon>
                  <SecText>{point.text}</SecText>
                </SecPoint>
              );
            })}
            <SecDisclaim>
              Dexrl is held in a centralized exchange, wide-mode trading venue or decentralized custodian platform.
            </SecDisclaim>
          </SecPoints>
        </SecGrid>
      </Wrap>
    </SecuritySection>
  );
}
