"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";

/* ── Header wrapper
   - Default (top): fully transparent, no blur
   - Scrolled:      frosted glass + bottom border
   ─────────────────────────────────────────────── */
const HeaderWrapper = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 50;
  transition:
    background    0.35s cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 0.35s ease,
    border-color  0.35s ease;

  background: ${(p) =>
    p.$scrolled
      ? "color-mix(in oklab, var(--bg) 90%, transparent)"
      : "transparent"};

  backdrop-filter: ${(p) =>
    p.$scrolled ? "saturate(160%) blur(14px)" : "none"};
  -webkit-backdrop-filter: ${(p) =>
    p.$scrolled ? "saturate(160%) blur(14px)" : "none"};

  border-bottom: 1px solid ${(p) =>
    p.$scrolled ? "var(--line)" : "transparent"};
`;

const Nav = styled.nav`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;

  @media (max-width: 820px) {
    padding: 0 20px;
  }
`;

/* Brand mark: light on transparent, dark on scrolled */
const BrandMark = styled.div<{ $scrolled: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-family: var(--serif);
  font-size: 16px;
  font-weight: 600;
  transition: background 0.35s ease, color 0.35s ease;

  background: ${(p) => (p.$scrolled ? "var(--ink)" : "#ECF0EF")};
  color:      ${(p) => (p.$scrolled ? "#ECF0EF"    : "var(--ink)")};
`;

const BrandWord = styled.div<{ $scrolled: boolean }>`
  font-family: var(--serif);
  font-size: 24px;
  letter-spacing: -0.02em;
  transition: color 0.35s ease;
  color: ${(p) => (p.$scrolled ? "var(--ink)" : "#ECF0EF")};
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 820px) {
    gap: 18px;
  }
`;

const NavLink = styled.a<{ $scrolled: boolean }>`
  font-size: 15px;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  color: ${(p) =>
    p.$scrolled ? "var(--ink-soft)" : "rgba(236, 240, 239, 0.70)"};

  &:hover {
    color: ${(p) => (p.$scrolled ? "var(--ink)" : "#ECF0EF")};
  }

  @media (max-width: 820px) {
    display: none;
  }
`;

const CTAButton = styled.button<{ $scrolled: boolean }>`
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 15px;
  transition:
    color         0.35s ease,
    background    0.35s ease,
    border-color  0.2s ease;

  /* Transparent state → ghost white button */
  color:      ${(p) => (p.$scrolled ? "var(--ink)"    : "#ECF0EF")};
  background: ${(p) => (p.$scrolled ? "var(--bg-elev)": "transparent")};
  border: 1px solid ${(p) =>
    p.$scrolled ? "var(--line)" : "rgba(236, 240, 239, 0.35)"};

  &:hover {
    border-color: ${(p) =>
      p.$scrolled ? "var(--ink)" : "rgba(236, 240, 239, 0.80)"};
    background: ${(p) =>
      p.$scrolled ? "var(--bg-elev)" : "rgba(255,255,255,0.08)"};
  }
`;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll(); // set on mount in case page is already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HeaderWrapper $scrolled={scrolled}>
      <Nav>
        <Brand>
          <BrandMark $scrolled={scrolled}>D</BrandMark>
          <BrandWord $scrolled={scrolled}>Dexrl</BrandWord>
        </Brand>

        <NavLinks>
          <NavLink href="#how"      $scrolled={scrolled}>How it works</NavLink>
          <NavLink href="#security" $scrolled={scrolled}>Security</NavLink>
          <CTAButton $scrolled={scrolled}>Talk to our team</CTAButton>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
}
