"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in oklab, var(--bg) 88%, transparent);
  backdrop-filter: saturate(140%) blur(10px);
  -webkit-backdrop-filter: saturate(140%) blur(10px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, background 0.2s ease;

  &.scrolled {
    border-bottom-color: var(--line);
  }
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

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BrandMark = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--ink);
  display: grid;
  place-items: center;
  color: var(--bg);
  font-family: var(--serif);
  font-size: 16px;
  font-weight: 600;
`;

const BrandWord = styled.div`
  font-family: var(--serif);
  font-size: 24px;
  letter-spacing: -0.02em;
  color: var(--ink);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 820px) {
    gap: 18px;
  }
`;

const NavLink = styled.a`
  font-size: 15px;
  color: var(--ink-soft);
  padding: 8px 0;
  position: relative;
  transition: color 0.15s ease;
  cursor: pointer;

  &:hover {
    color: var(--ink);
  }

  @media (max-width: 820px) {
    display: none;
  }
`;

const CTAButton = styled.button`
  color: var(--ink);
  border: 1px solid var(--line);
  padding: 9px 16px;
  border-radius: 999px;
  background: var(--bg-elev);
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
  font-size: 15px;

  &:hover {
    border-color: var(--ink);
  }
`;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeaderWrapper className={scrolled ? "scrolled" : ""}>
      <Nav>
        <Brand>
          <BrandMark>D</BrandMark>
          <BrandWord>Dexrl</BrandWord>
        </Brand>
        <NavLinks>
          <NavLink href="#how">How it works</NavLink>
          <NavLink href="#security">Security</NavLink>
          <CTAButton>Talk to our team</CTAButton>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
}
