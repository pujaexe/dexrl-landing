"use client";

import styled from "styled-components";

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

  @media (max-width: 720px) {
    padding: 0 20px;
  }
`;

const FooterInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BrandMark = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--ink);
  display: grid;
  place-items: center;
  color: var(--bg);
  font-family: var(--serif);
  font-size: 14px;
  font-weight: 600;
`;

const BrandWord = styled.div`
  font-family: var(--serif);
  font-size: 16px;
  letter-spacing: -0.02em;
  color: var(--ink);
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
          <Brand>
            <BrandMark>D</BrandMark>
            <BrandWord>Dexrl</BrandWord>
          </Brand>
          <Copyright>© 2024 Dexrl Inc.</Copyright>
        </FooterInner>
      </Wrap>
    </FooterElement>
  );
}
