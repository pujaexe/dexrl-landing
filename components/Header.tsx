"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { DexRLLogo } from "./DexRLLogo";

const HeaderWrapper = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 50;
  transition:
    background      0.35s cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 0.35s ease,
    border-color    0.35s ease;

  background: ${(p) =>
    p.$scrolled ? "color-mix(in oklab, var(--bg) 90%, transparent)" : "transparent"};
  backdrop-filter: ${(p) => p.$scrolled ? "saturate(160%) blur(14px)" : "none"};
  -webkit-backdrop-filter: ${(p) => p.$scrolled ? "saturate(160%) blur(14px)" : "none"};
  border-bottom: 1px solid ${(p) => p.$scrolled ? "var(--line)" : "transparent"};
`;

const Nav = styled.nav`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  @media (max-width: 820px) { padding: 0 20px; }
`;

/* Logo wrapper — color property drives SVG fill via currentColor */
const LogoLink = styled.a<{ $scrolled: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.35s ease, opacity 0.2s ease;
  color: ${(p) => p.$scrolled ? "#003e2c" : "#ECF0EF"};
  &:hover { opacity: 0.82; }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  @media (max-width: 820px) { gap: 18px; }
`;

const NavLink = styled.a<{ $scrolled: boolean }>`
  font-size: 15px;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.2s ease;
  color: ${(p) => p.$scrolled ? "var(--ink-soft)" : "rgba(236,240,239,0.70)"};
  &:hover { color: ${(p) => p.$scrolled ? "var(--ink)" : "#ECF0EF"}; }
  @media (max-width: 820px) { display: none; }
`;

const CTAButton = styled.button<{ $scrolled: boolean }>`
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 15px;
  transition: color 0.35s ease, background 0.35s ease, border-color 0.2s ease;
  color:      ${(p) => p.$scrolled ? "var(--ink)"     : "#ECF0EF"};
  background: ${(p) => p.$scrolled ? "var(--bg-elev)" : "transparent"};
  border: 1px solid ${(p) => p.$scrolled ? "var(--line)" : "rgba(236,240,239,0.35)"};
  &:hover {
    border-color: ${(p) => p.$scrolled ? "var(--ink)"                   : "rgba(236,240,239,0.80)"};
    background:   ${(p) => p.$scrolled ? "var(--bg-elev)"               : "rgba(255,255,255,0.08)"};
  }
`;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HeaderWrapper $scrolled={scrolled}>
      <Nav>
        {/* Official dexRL wordmark SVG — color adapts to scroll state */}
        <LogoLink href="/" $scrolled={scrolled} aria-label="dexRL home">
          <DexRLLogo />
        </LogoLink>

        <NavLinks>
          <NavLink href="#how"      $scrolled={scrolled}>How it works</NavLink>
          <NavLink href="#security" $scrolled={scrolled}>Security</NavLink>
          <CTAButton $scrolled={scrolled}>Talk to our team</CTAButton>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
}
