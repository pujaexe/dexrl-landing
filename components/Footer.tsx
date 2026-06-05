"use client";

import styled from "styled-components";
import { DexRLLogo } from "./DexRLLogo";

const FooterElement = styled.footer`
  border-top: 1px solid var(--line);
  padding: 36px 0 48px;
  font-size: 13px;
  color: var(--ink-mute);
`;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  @media (max-width: 720px) { padding: 0 20px; }
`;

const FooterInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

/* Logo in footer — always dark/color version on light background */
const FooterLogo = styled.a`
  display: flex;
  align-items: center;
  color: var(--ink);
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s ease;
  &:hover { opacity: 1; }
`;

const Copyright = styled.div`
  font-size: 13px;
  color: var(--ink-mute);
`;

export function Footer() {
  return (
    <FooterElement>
      <Wrap>
        <FooterInner>
          <FooterLogo href="/" aria-label="dexRL home">
            <DexRLLogo style={{ height: "20px" }} />
          </FooterLogo>
          <Copyright>© 2026 dexRL Inc. All rights reserved.</Copyright>
        </FooterInner>
      </Wrap>
    </FooterElement>
  );
}
