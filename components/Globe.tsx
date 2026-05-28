"use client";

import styled from "styled-components";
import { GlobeVisualization } from "./GlobeVisualization";
import { Reveal } from "./Reveal";

const GlobeSection = styled.section``;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 720px) {
    padding: 0 20px;
  }
`;

const GlobeStage = styled.div`
  background: var(--bg-deep);
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  color: oklch(95% 0.005 200);
  padding: 64px;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 80px;
  align-items: center;
  min-height: 620px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 40px;
    min-height: auto;
    padding: 40px 28px;
  }
`;

const GlobeCopy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
`;

const SectionEyebrow = styled.div`
  font-size: 13px;
  color: oklch(60% 0.012 200);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0;
  font-family: var(--sans);
  font-weight: 500;
`;

const H2 = styled.h2`
  font-family: var(--serif);
  font-size: clamp(36px, 4.4vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.022em;
  font-weight: 400;
  color: oklch(96% 0.005 200);
  margin: 0;
  text-wrap: balance;

  em {
    font-style: italic;
    color: oklch(78% 0.05 200);
  }
`;

const Sub = styled.p`
  font-size: 18px;
  color: oklch(72% 0.012 200);
  max-width: 60ch;
  line-height: 1.55;
  text-wrap: pretty;
  margin: 0;
`;

const GlobeMeta = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 8px;
  font-size: 13px;
  color: oklch(60% 0.012 200);
  letter-spacing: 0.04em;
  text-transform: uppercase;

  b {
    color: oklch(86% 0.025 200);
    font-weight: 500;
  }
`;

const GlobeVisual = styled.div`
  position: relative;
  min-height: 620px;
  background: radial-gradient(circle at 40% 50%, oklch(22% 0.015 220), oklch(12% 0.01 220));
  border-radius: 20px;
  overflow: hidden;
  color: oklch(95% 0.005 200);

  @media (max-width: 980px) {
    min-height: 480px;
  }
`;

export function Globe() {
  return (
    <GlobeSection>
      <Wrap>
        <Reveal y={40}>
          <GlobeStage>
            <GlobeCopy>
              <Reveal delay={80}><SectionEyebrow>Corridors</SectionEyebrow></Reveal>
              <Reveal delay={160}>
                <H2>Stablecoin rails <em>across Asia.</em></H2>
              </Reveal>
              <Reveal delay={240}>
                <Sub>
                  Dexrl opens direct stablecoin settlement flows between countries, enabling from Indonesia and supporting similar flows.
                </Sub>
              </Reveal>
              <Reveal delay={320}>
                <GlobeMeta>
                  <div><b>Indonesia</b> to Singapore</div>
                </GlobeMeta>
              </Reveal>
            </GlobeCopy>
            <GlobeVisual>
              <GlobeVisualization />
            </GlobeVisual>
          </GlobeStage>
        </Reveal>
      </Wrap>
    </GlobeSection>
  );
}
