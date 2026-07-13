"use client";

import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { ArrowLeftRight, ChevronDown, ChevronRight, ChevronLeft, Lock, CheckCircle2, Loader2, X, Search, Landmark, Wallet } from "lucide-react";

/* ── Animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: none; }
`;

const grainShift = keyframes`
  0%   { transform: translate(0%,    0%); }
  12%  { transform: translate(-4%,  -9%); }
  24%  { transform: translate(-9%,   4%); }
  36%  { transform: translate(3%,  -14%); }
  48%  { transform: translate(-6%,  11%); }
  60%  { transform: translate(10%,  -3%); }
  72%  { transform: translate(-2%,   8%); }
  84%  { transform: translate(7%,   -7%); }
  100% { transform: translate(0%,    0%); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const FadeUp = styled.div<{ $delay?: number }>`
  animation: ${fadeUp} 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${(p) => p.$delay ?? 0}ms;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

/* ── Hero section ── */
const HeroSection = styled.section`
  padding: 152px 0 96px;
  position: relative;
  overflow: hidden;
  isolation: isolate;

  background:
    radial-gradient(ellipse 62% 68% at 14% 68%, rgba(203,242,61,0.50) 0%, transparent 62%),
    radial-gradient(ellipse 48% 42% at -4%  4%, rgba(236,240,239,0.20) 0%, transparent 55%),
    radial-gradient(ellipse 38% 38% at 38% 96%, rgba(203,242,61,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 58% 62% at 44%  2%, rgba(0,88,64,0.68)    0%, transparent 65%),
    radial-gradient(ellipse 62% 68% at 92% 28%, rgba(0,33,22,0.92)    0%, transparent 65%),
    radial-gradient(ellipse 50% 50% at 58% 100%,rgba(0,62,44,0.58)    0%, transparent 62%),
    #001B0E;

  &::before {
    content: '';
    position: absolute;
    inset: -55%;
    width: 210%;
    height: 210%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72 0.68' numOctaves='4' seed='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E");
    background-size: 220px 220px;
    opacity: 0.055;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 0;
    animation: ${grainShift} 0.65s steps(1) infinite;
  }

  @media (prefers-reduced-motion: reduce) { &::before { animation: none; } }
`;

const Wrap = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
  @media (max-width: 720px) { padding: 0 20px; }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;
  @media (max-width: 980px) { grid-template-columns: 1fr; gap: 48px; }
`;

const HeroContent = styled.div``;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(203,242,61,0.72);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 18px;
  &::before { content: "•"; color: #CBF23D; }
`;

const H1 = styled.h1`
  font-family: var(--serif);
  font-size: clamp(48px, 6.4vw, 84px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 18px 0 24px;
  color: #ECF0EF;
  text-wrap: balance;
  font-weight: 400;
  em { font-style: italic; color: #CBF23D; }
`;

const Lede = styled.p`
  font-size: 19px;
  color: rgba(236,240,239,0.78);
  max-width: 52ch;
  text-wrap: pretty;
  line-height: 1.58;
  margin: 0;
`;

const HeroCTAs = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 36px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 26px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.005em;
  border: 1px solid transparent;
  transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease,
    color 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;

  ${(props) => props.$variant === "ghost" ? `
    background: transparent;
    color: rgba(236,240,239,0.90);
    border-color: rgba(255,255,255,0.28);
    &:hover { border-color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.07); }
  ` : `
    background: #CBF23D;
    color: #003E2C;
    font-weight: 600;
    box-shadow: 0 0 28px rgba(203,242,61,0.38);
    &:hover { background: #b8d934; transform: translateY(-1px); box-shadow: 0 0 40px rgba(203,242,61,0.52); }
  `}
`;

const HeroTrust = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  color: rgba(236,240,239,0.48);
  font-size: 13px;
  flex-wrap: wrap;
  letter-spacing: 0.01em;

  span {
    display: flex;
    align-items: center;
    gap: 7px;
    &::before {
      content: '';
      width: 4px; height: 4px;
      border-radius: 50%;
      background: rgba(203,242,61,0.50);
      flex-shrink: 0;
    }
    &:first-child::before { display: none; }
  }
`;

/* ═══════════════════════════════════════════════════════
   SWAP WIDGET STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const SwapBox = styled.div`
  position: relative;
  background: rgba(255,255,255,0.97);
  border: 1px solid rgba(255,255,255,0.55);
  border-radius: 20px;
  padding: 20px;
  box-shadow:
    0 0 0 1px rgba(0,33,22,0.06),
    0 8px 32px -8px rgba(0,20,10,0.40),
    0 32px 80px -16px rgba(0,14,7,0.60);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  overflow: hidden;
`;

/* ── Success overlay ── */
const SuccessOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.98);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 20;
  animation: ${popIn} 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
  svg { color: #26a17b; }
`;

const SuccessTitle = styled.div`
  font-family: var(--serif);
  font-size: 20px;
  color: var(--ink);
  margin-top: 4px;
`;

const SuccessNote = styled.div`
  font-size: 13px;
  color: var(--ink-mute);
  text-align: center;
  max-width: 200px;
  line-height: 1.5;
`;

/* ── Connect Account bottom sheet ── */
const ConnectBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 31, 20, 0.52);
  z-index: 16;
  display: flex;
  align-items: flex-end;
  border-radius: 20px;
`;

const ConnectSheet = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 0 16px 24px;
  animation: ${slideUp} 0.26s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const SheetHandle = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #E6ECEA;
  margin: 10px auto 18px;
`;

const SheetTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 14px;
`;

const ConnectOption = styled.button<{ $dim?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border: 1.5px solid #E6ECEA;
  border-radius: 12px;
  background: #fff;
  cursor: ${(p) => (p.$dim ? "not-allowed" : "pointer")};
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 10px;
  opacity: ${(p) => (p.$dim ? 0.42 : 1)};
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
  text-align: left;
  &:last-of-type { margin-bottom: 0; }
  ${(p) => !p.$dim && "&:hover { background: #F4F7F6; border-color: var(--line); }"}
`;

const ConnectOptionBadge = styled.span`
  margin-left: auto;
  font-size: 10.5px;
  color: var(--ink-mute);
  font-weight: 400;
  white-space: nowrap;
`;

const SheetFooter = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;
  justify-content: center;
`;

const SheetLink = styled.span`
  font-size: 11.5px;
  color: var(--ink-mute);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  &:hover { color: var(--ink-soft); }
`;

/* ── Token Selector overlay ── */
const TokenSelectorOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: 20px;
  z-index: 15;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const SelectorHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 16px 10px;
  flex-shrink: 0;
  gap: 12px;
`;

const SelectorTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SelectorTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
`;

const SelectorSub = styled.p`
  font-size: 11px;
  color: var(--ink-mute);
  margin: 0;
  line-height: 1.45;
`;

const CloseSelectorBtn = styled.button`
  width: 26px; height: 26px;
  border-radius: 50%;
  border: none;
  background: #F4F7F6;
  display: grid; place-items: center;
  color: var(--ink-mute);
  cursor: pointer;
  padding: 0;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #E6ECEA; color: var(--ink); }
`;

const SearchWrap = styled.div`
  position: relative;
  padding: 0 14px 10px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 9px 34px 9px 12px;
  border: 1.5px solid #E6ECEA;
  border-radius: 10px;
  background: #F4F7F6;
  font-size: 13px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  &::placeholder { color: var(--ink-mute); }
  &:focus { border-color: var(--line); background: #fff; }
`;

const SearchIconWrap = styled.div`
  position: absolute;
  right: 26px; top: 50%; transform: translateY(-50%);
  color: var(--ink-mute);
  pointer-events: none;
  display: flex;
`;



const ChainIconInner = styled.div<{ $bg: string; $color?: string }>`
  width: 30px; height: 30px;
  border-radius: 8px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color ?? "#fff"};
  display: grid; place-items: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

const ChainImg = styled.img`
  width: 30px; height: 30px;
  border-radius: 8px;
  object-fit: cover;
`;

const NetworkSectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--ink-mute);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 6px 16px 4px;
  background: #F8FAF9;
  border-top: 1px solid #F0F3F2;
  border-bottom: 1px solid #F0F3F2;
  flex-shrink: 0;
`;

const TokenList = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #E6ECEA transparent;
`;

const TokenListItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border: none;
  background: ${(p) => (p.$active ? "#F0F5F3" : "transparent")};
  cursor: pointer;
  border-bottom: 1px solid #F4F7F6;
  text-align: left;
  transition: background 0.1s;
  &:hover { background: #F4F7F6; }
  &:last-child { border-bottom: none; }
`;

const TokenListIcon = styled.div<{ $bg: string }>`
  width: 28px; height: 28px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: #fff;
  display: grid; place-items: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 0 0 1.5px rgba(0,0,0,0.06);
`;

const TokenListImg = styled.img`
  width: 28px; height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 0 0 1.5px rgba(0,0,0,0.06);
`;

const TokenBoxImg = styled.img`
  width: 32px; height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const TokenBoxImgSm = styled.img`
  width: 28px; height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const TokenListMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TokenListNameRow = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TokenListTicker = styled.span`
  font-size: 11.5px;
  font-weight: 400;
  color: var(--ink-mute);
`;

const TokenListNet = styled.div<{ $color: string }>`
  font-size: 11px;
  color: ${(p) => p.$color};
  font-weight: 500;
`;

const IDRXListItem = styled(TokenListItem)`
  background: rgba(203,242,61,0.08);
  border-bottom: 2px solid #E6ECEA;
  margin-bottom: 2px;
  &:hover { background: rgba(203,242,61,0.14); }
`;

const IDRXBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1a3d00;
  background: rgba(203,242,61,0.60);
  border-radius: 999px;
  padding: 2px 8px;
`;

/* ── Two-panel selector layout ── */
const NetworkPickItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
  border-bottom: 1px solid #F4F7F6;
  &:hover { background: #F4F7F6; }
  &:last-child { border-bottom: none; }
`;

const NetworkPickLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
`;

const NetworkBackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-mute);
  padding: 10px 16px 6px;
  flex-shrink: 0;
  &:hover { color: var(--ink); }
`;


/* ── Swap form styled components ── */
const SwapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SwapTitle = styled.h3`
  font-family: var(--serif);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0;
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserEmail = styled.span`
  font-size: 11.5px;
  color: var(--ink-mute);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const GoogleBtn = styled.button`
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  background: #fff;
  display: grid; place-items: center;
  flex-shrink: 0;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.15s;
  &:hover { border-color: var(--ink-mute); }
`;

const SignInLink = styled.button`
  font-size: 12px;
  color: var(--ink-soft);
  background: none;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: var(--ink-mute); color: var(--ink); }
`;

const TokenRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 36px 1fr;
  gap: 6px;
  align-items: end;
  margin-bottom: 12px;
`;

const TokenColWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FieldLabel = styled.div`
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ink-mute);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding-left: 2px;
`;

const TokenBox = styled.div<{ $clickable?: boolean }>`
  background: #F4F7F6;
  border: 1.5px solid #E6ECEA;
  border-radius: 10px;
  padding: 9px 11px;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  transition: border-color 0.15s ease, background 0.15s ease;
  ${(p) => p.$clickable && "&:hover { border-color: var(--line); background: #EEF2F0; }"}
`;

const TokenCircle = styled.div<{ $bg: string }>`
  width: 32px; height: 32px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: #fff;
  display: grid; place-items: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: -0.02em;
`;

const TokenCircleSm = styled(TokenCircle)`
  width: 28px; height: 28px;
  font-size: 12px;
`;

const TokenInfo = styled.div`
  flex: 1; min-width: 0; overflow: hidden;
`;

const TokenNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 600;
  font-size: 13px;
  color: var(--ink);
  line-height: 1.25;
`;

const TokenSubLine = styled.div`
  font-size: 10px;
  color: var(--ink-mute);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SwapDirBtn = styled.button`
  width: 34px; height: 34px;
  border-radius: 50%;
  background: #F4F7F6;
  border: 1.5px solid #E6ECEA;
  display: grid; place-items: center;
  color: var(--ink-mute);
  cursor: pointer;
  margin-bottom: 2px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  &:hover { border-color: var(--accent); color: var(--ink); background: var(--accent-soft); }
`;

const SectionBlock = styled.div`
  margin-bottom: 10px;
`;

const AmountField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F4F7F6;
  border: 1.5px solid #E6ECEA;
  border-radius: 10px;
  padding: 10px 13px;
  margin-top: 5px;
  transition: border-color 0.15s;
  &:focus-within { border-color: var(--line); }
`;

const AmountInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--serif);
  font-size: 26px;
  color: var(--ink);
  letter-spacing: -0.02em;
  min-width: 0;
  &::placeholder { color: #C2CFCB; }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  -moz-appearance: textfield;
`;

const AddressInput = styled.input`
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 5px;
  background: #F4F7F6;
  border: 1.5px solid #E6ECEA;
  border-radius: 10px;
  padding: 13px;
  font-size: 13px;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s;
  &::placeholder { color: var(--ink-mute); font-size: 13px; }
  &:focus { border-color: var(--line); }
`;

const ReceivingAccountBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F4F7F6;
  border: 1.5px solid #E6ECEA;
  border-radius: 10px;
  padding: 13px;
  margin-top: 5px;
  min-height: 52px;
`;

const NoAccountText = styled.span`
  font-size: 13px;
  color: var(--ink-mute);
`;

const AddAccountBtn = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  background: #fff;
  border: 1.5px solid #C2CFCB;
  border-radius: 999px;
  padding: 5px 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: var(--ink-mute); background: #F4F7F6; }
`;

const BankInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const BankName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
`;

const BankAcct = styled.div`
  font-size: 11.5px;
  color: var(--ink-mute);
  font-variant-numeric: tabular-nums;
`;

const ChangeAcctBtn = styled(AddAccountBtn)`
  font-size: 11.5px;
  padding: 4px 11px;
`;

const MetamaskAddrField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F4F7F6;
  border: 1.5px solid #E6ECEA;
  border-radius: 10px;
  padding: 13px;
  margin-top: 5px;
`;

const MetamaskAddrText = styled.span`
  font-size: 13px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
`;

const MetamaskBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-soft);
  white-space: nowrap;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' viewBox='0 0 10 8'%3E%3Cpath d='M1 4l2.5 2.5L9 1' stroke='white' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const QuoteMeta = styled.div`
  border-top: 1.5px solid #E6ECEA;
  margin-top: 12px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetaKey = styled.span`
  font-size: 12px;
  color: var(--ink-soft);
`;

const MetaVal = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
`;

const TimerVal = styled(MetaVal)`
  color: #497bf8;
`;

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 0.9s linear infinite;
`;

const ActionBtn = styled.button<{ $dim?: boolean }>`
  width: 100%;
  height: 52px;
  margin-top: 14px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--on-accent);
  border: none;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.005em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${(p) => (p.$dim ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.$dim ? 0.5 : 1)};
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: ${(p) => (p.$dim ? "none" : "0 0 18px rgba(203,242,61,0.28)")};
  &:hover:not([aria-disabled="true"]) {
    background: ${(p) => (p.$dim ? "var(--accent)" : "#b8d934")};
    transform: ${(p) => (p.$dim ? "none" : "translateY(-1px)")};
    box-shadow: ${(p) => (p.$dim ? "none" : "0 0 30px rgba(203,242,61,0.45)")};
  }
`;

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const CI = "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color";

const NETWORKS = [
  { id: "tron",     label: "Tron",     iconBg: "#FF060A", iconColor: "#fff",    letter: "T", netColor: "#EF4444", icon: `${CI}/trx.svg`  },
  { id: "polygon",  label: "Polygon",  iconBg: "#8247E5", iconColor: "#fff",    letter: "P", netColor: "#8247E5", icon: `${CI}/matic.svg` },
  { id: "bsc",      label: "BSC",      iconBg: "#1E2026", iconColor: "#F0B90B", letter: "B", netColor: "#F0B90B", icon: `${CI}/bnb.svg`  },
  { id: "ethereum", label: "Ethereum", iconBg: "#454A75", iconColor: "#fff",    letter: "E", netColor: "#627EEA", icon: `${CI}/eth.svg`  },
  { id: "solana",   label: "Solana",   iconBg: "#1A1A2E", iconColor: "#9945FF", letter: "S", netColor: "#9945FF", icon: `${CI}/sol.svg`  },
] as const;

type NetworkId = typeof NETWORKS[number]["id"];

interface TokenEntry {
  symbol: string;
  name: string;
  bg: string;
  letter: string;
  icon?: string;
}

const TOKEN_LIST: Record<NetworkId, TokenEntry[]> = {
  tron: [
    { symbol: "USDT", name: "Tether USD", bg: "#26a17b", letter: "₮", icon: `${CI}/usdt.svg` },
    { symbol: "USDC", name: "USD Coin",   bg: "#2775CA", letter: "$", icon: `${CI}/usdc.svg` },
  ],
  polygon: [
    { symbol: "USDC", name: "USD Coin",       bg: "#2775CA", letter: "$", icon: `${CI}/usdc.svg` },
    { symbol: "JPYC", name: "JPY Coin (PoS)", bg: "#E33328", letter: "¥" },
    { symbol: "XSGD", name: "XSGD",           bg: "#1A4C9B", letter: "X" },
  ],
  bsc: [
    { symbol: "USDT", name: "Tether USD", bg: "#26a17b", letter: "₮", icon: `${CI}/usdt.svg` },
    { symbol: "USDC", name: "USD Coin",   bg: "#2775CA", letter: "$", icon: `${CI}/usdc.svg` },
  ],
  ethereum: [
    { symbol: "USDC", name: "USD Coin",    bg: "#2775CA", letter: "$", icon: `${CI}/usdc.svg` },
    { symbol: "USDT", name: "Tether USD",  bg: "#26a17b", letter: "₮", icon: `${CI}/usdt.svg` },
    { symbol: "EURC", name: "EURC",        bg: "#2775CA", letter: "€" },
    { symbol: "EURS", name: "STASIS EURO", bg: "#1C4B9C", letter: "€", icon: `${CI}/eurs.svg` },
    { symbol: "JPYC", name: "JPY Coin v1", bg: "#E33328", letter: "¥" },
    { symbol: "XSGD", name: "XSGD",        bg: "#1A4C9B", letter: "X" },
  ],
  solana: [
    { symbol: "USDC", name: "USD Coin",     bg: "#2775CA", letter: "$", icon: `${CI}/usdc.svg` },
    { symbol: "USDT", name: "Tether USD",   bg: "#26a17b", letter: "₮", icon: `${CI}/usdt.svg` },
    { symbol: "EURC", name: "EURC",         bg: "#2775CA", letter: "€" },
    { symbol: "MYRC", name: "MYRC",         bg: "#8247E5", letter: "M" },
    { symbol: "XSGD", name: "StraitsX SGD", bg: "#1A4C9B", letter: "X" },
  ],
};

// 1 token = X IDRX
const TOKEN_RATES: Record<string, number> = {
  USDT: 15950, USDC: 15950,
  EURC: 17700, EURS: 17700,
  JPYC: 106,
  XSGD: 11750,
  MYRC: 3490,
};

interface SelectedToken extends TokenEntry {
  networkId: NetworkId;
  networkLabel: string;
  networkColor: string;
}

// Flat unique token list (deduped across networks)
const ALL_TOKENS: TokenEntry[] = [
  { symbol: "USDT", name: "Tether USD",  bg: "#26a17b", letter: "₮", icon: `${CI}/usdt.svg` },
  { symbol: "USDC", name: "USD Coin",    bg: "#2775CA", letter: "$",  icon: `${CI}/usdc.svg` },
  { symbol: "EURC", name: "EURC",        bg: "#2775CA", letter: "€" },
  { symbol: "EURS", name: "STASIS EURO", bg: "#1C4B9C", letter: "€",  icon: `${CI}/eurs.svg` },
  { symbol: "JPYC", name: "JPY Coin",    bg: "#E33328", letter: "¥" },
  { symbol: "XSGD", name: "XSGD",        bg: "#1A4C9B", letter: "X" },
  { symbol: "MYRC", name: "MYRC",        bg: "#8247E5", letter: "M" },
];

const getTokenNetworks = (symbol: string) =>
  NETWORKS.filter(net => TOKEN_LIST[net.id].some(t => t.symbol === symbol));

const IDRX_TOKEN: SelectedToken = {
  symbol: "IDRX", name: "Indonesian Rupiah Stablecoin",
  bg: "#1e4db7", letter: "X",
  networkId: "polygon", networkLabel: "Regulated IDR", networkColor: "#8247E5",
};

const DEFAULT_USDT: SelectedToken = {
  symbol: "USDT", name: "Tether USD", bg: "#26a17b", letter: "₮",
  icon: `${CI}/usdt.svg`,
  networkId: "polygon", networkLabel: "On Polygon", networkColor: "#8247E5",
};

/* ═══════════════════════════════════════════════════════
   SWAP WIDGET
   ═══════════════════════════════════════════════════════ */

const GOOGLE_SVG = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

const METAMASK_SVG = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#F6851B"/>
    <path d="M22.4 8L17.6 11.52l.9-2.12L22.4 8z" fill="#E2761B"/>
    <path d="M9.6 8l4.76 3.55-.86-2.11L9.6 8z" fill="#E4761B"/>
    <path d="M20.6 20.22l-1.28 1.96 2.74.76.79-2.66-2.25-.06zM9.08 20.28l.78 2.66 2.74-.76-1.28-1.96-2.24.06z" fill="#E4761B"/>
    <path d="M12.42 15.18l-.77 1.16 2.75.12-.1-2.95-1.88 1.67zM19.58 15.18l-1.9-1.7-.1 2.98 2.74-.12-.74-1.16z" fill="#E4761B"/>
    <path d="M12.6 22.18l1.65-.76-1.42-1.11-.23 1.87zM17.75 21.42l1.65.76-.24-1.87-1.41 1.11z" fill="#D7C1B3"/>
    <path d="M19.4 22.18l-1.65-.76.13 1.09-.01.43 1.53-.76zM12.6 22.18l1.53.76-.01-.43.13-1.09-1.65.76z" fill="#233447"/>
    <path d="M14.15 19.46l-1.38-.4.97-.45.41.85zM17.85 19.46l.41-.85.98.45-1.39.4z" fill="#CD6116"/>
    <path d="M12.6 22.18l.24-1.96-.81.73.57 1.23zM19.16 20.22l.24 1.96.57-1.23-.81-.73z" fill="#E4751F"/>
    <path d="M19.58 17.8l-2.74.12.26 1.54.41-.85.98.45 1.09-1.26zM11.59 17.93l.98-.45.41.85.25-1.53-2.74-.12 1.1 1.25z" fill="#F6851B"/>
    <path d="M11.42 17.34l1.16 2.26-.04-1.26-1.12-.99zM19.62 18.34l-.04 1.26 1.16-2.26-1.12.99z" fill="#FFC300"/>
    <path d="M14.36 17.92l-.25 1.53.31 1.62.07-2.13-.13-1.02zM17.64 17.92l-.13 1.02.07 2.13.31-1.62-.25-1.53z" fill="#E4761B"/>
    <path d="M17.85 19.46l-.31 1.62.22.15 1.41-1.11.04-1.26-1.36.6zM12.77 19.07l.04 1.26 1.41 1.11.22-.15-.31-1.62-1.36-.6z" fill="#CD6116"/>
  </svg>
);

function SwapWidget() {
  const [connectMethod, setConnectMethod]       = useState<"google" | "metamask" | null>(null);
  const [showConnectSheet, setShowConnectSheet] = useState(false);
  const connected = connectMethod !== null;

  const MOCK_WALLET = "0x142FaE65689F7...4C1c0";
  const [amount, setAmount]         = useState("");
  const [address, setAddress]       = useState("");
  const [swapStatus, setSwapStatus] = useState<"idle" | "loading" | "success">("idle");
  const [timer, setTimer]           = useState(60);
  const [hasAccount, setHasAccount] = useState(false);

  // Both sides are now selectable
  const [fromToken, setFromToken] = useState<SelectedToken>(IDRX_TOKEN);
  const [toToken, setToToken]     = useState<SelectedToken>(DEFAULT_USDT);

  // Token selector state
  const [selectingToken, setSelectingToken] = useState(false);
  const [selectorSource, setSelectorSource] = useState<"from" | "to">("to");
  const [pendingToken, setPendingToken]     = useState<TokenEntry | null>(null);
  const [tokenSearch, setTokenSearch]       = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Derive which flow we're in from the token pair
  const swapMode: "onramp" | "offramp" | "walletswap" =
    fromToken.symbol === "IDRX" ? "onramp" :
    toToken.symbol   === "IDRX" ? "offramp" : "walletswap";

  const numAmount = parseFloat(amount) || 0;

  const minReceived = (() => {
    if (numAmount === 0) return `0 ${toToken.symbol}`;
    if (swapMode === "onramp") {
      const rate = TOKEN_RATES[toToken.symbol] ?? 15950;
      return `${((numAmount / rate) * 0.993).toFixed(4)} ${toToken.symbol}`;
    }
    if (swapMode === "offramp") {
      const rate = TOKEN_RATES[fromToken.symbol] ?? 15950;
      return `IDRX ${Math.round(numAmount * rate * 0.993).toLocaleString()}`;
    }
    // walletswap: cross-token via IDRX as common unit
    const fromRate = TOKEN_RATES[fromToken.symbol] ?? 15950;
    const toRate   = TOKEN_RATES[toToken.symbol]   ?? 15950;
    return `${((numAmount * fromRate / toRate) * 0.993).toFixed(4)} ${toToken.symbol}`;
  })();

  const addrReady = connectMethod === "metamask" ? true : address.trim().length >= 10;
  const canSwap   = connected && numAmount > 0 && (swapMode === "offramp" ? hasAccount : addrReady);

  const fromSubLine = fromToken.symbol === "IDRX" ? "1 IDRX ≈ 1 IDR" : fromToken.networkLabel;
  const toSubLine   = toToken.symbol   === "IDRX" ? "1 IDRX ≈ 1 IDR" : toToken.networkLabel;

  // Countdown timer
  useEffect(() => {
    if (!connected || !amount) { setTimer(60); return; }
    const id = setInterval(() => setTimer((t) => (t > 1 ? t - 1 : 60)), 1000);
    return () => clearInterval(id);
  }, [connected, amount]);
  useEffect(() => { setTimer(60); }, [amount]);

  // Focus search on selector open; reset state on close
  useEffect(() => {
    if (selectingToken) setTimeout(() => searchRef.current?.focus(), 60);
    else { setTokenSearch(""); setPendingToken(null); }
  }, [selectingToken]);

  const openConnectSheet = () => setShowConnectSheet(true);

  const handleConnected = (method: "google" | "metamask") => {
    setConnectMethod(method);
    setShowConnectSheet(false);
    if (method === "metamask" && swapMode !== "offramp") setAddress(MOCK_WALLET);
  };

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
    setAddress("");
  };

  const handleSwap = () => {
    if (!canSwap || swapStatus !== "idle") return;
    setSwapStatus("loading");
    setTimeout(() => {
      setSwapStatus("success");
      setTimeout(() => { setSwapStatus("idle"); setAmount(""); setAddress(""); }, 2600);
    }, 1800);
  };

  // Step 1: user picks a token — if only one network, complete immediately; else show network panel
  const handlePendingToken = (token: TokenEntry) => {
    const nets = getTokenNetworks(token.symbol);
    if (nets.length === 1) {
      handleSelectToken({
        ...token,
        networkId: nets[0].id,
        networkLabel: `On ${nets[0].label}`,
        networkColor: nets[0].netColor,
      });
    } else {
      setPendingToken(token);
    }
  };

  // Step 2: user picks a network for the pending token
  const handleNetworkSelect = (net: typeof NETWORKS[number]) => {
    if (!pendingToken) return;
    handleSelectToken({
      ...pendingToken,
      networkId: net.id,
      networkLabel: `On ${net.label}`,
      networkColor: net.netColor,
    });
  };

  const handleSelectToken = (token: SelectedToken) => {
    if (selectorSource === "from") {
      if (token.symbol === "IDRX" && toToken.symbol === "IDRX") setToToken(DEFAULT_USDT);
      setFromToken(token);
    } else {
      if (token.symbol === "IDRX" && fromToken.symbol === "IDRX") setFromToken(DEFAULT_USDT);
      setToToken(token);
    }
    setSelectingToken(false);
    setAmount("");
    setAddress("");
  };

  const filteredAllTokens = ALL_TOKENS.filter(t =>
    t.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.name.toLowerCase().includes(tokenSearch.toLowerCase())
  );
  const showIDRX = !tokenSearch ||
    "idrx".includes(tokenSearch.toLowerCase()) ||
    "indonesian rupiah stablecoin".includes(tokenSearch.toLowerCase());

  return (
    <SwapBox>
      {/* ── Success overlay ── */}
      {swapStatus === "success" && (
        <SuccessOverlay>
          <CheckCircle2 size={44} strokeWidth={1.5} />
          <SuccessTitle>Transaction Submitted!</SuccessTitle>
          <SuccessNote>Your swap is being processed on-chain</SuccessNote>
        </SuccessOverlay>
      )}

      {/* ── Connect bottom sheet ── */}
      {showConnectSheet && (
        <ConnectBackdrop onClick={() => setShowConnectSheet(false)}>
          <ConnectSheet onClick={(e) => e.stopPropagation()}>
            <SheetHandle />
            <SheetTitle>
              {swapMode === "walletswap" ? "Connect Wallet" : "Connect Account"}
            </SheetTitle>

            <ConnectOption
              $dim={swapMode === "walletswap"}
              onClick={swapMode === "walletswap" ? undefined : () => handleConnected("google")}
            >
              {GOOGLE_SVG(26)}
              Continue with Google
              {swapMode === "walletswap" && <ConnectOptionBadge>IDR flows only</ConnectOptionBadge>}
            </ConnectOption>

            <ConnectOption onClick={() => handleConnected("metamask")}>
              {METAMASK_SVG(26)}
              Continue with Metamask
            </ConnectOption>

            <SheetFooter>
              <SheetLink>Terms & Conditions</SheetLink>
              <SheetLink>Privacy Policy</SheetLink>
            </SheetFooter>
          </ConnectSheet>
        </ConnectBackdrop>
      )}

      {/* ── Token selector overlay ── */}
      {selectingToken && (
        <TokenSelectorOverlay>
          <SelectorHeader>
            <SelectorTitleGroup>
              <SelectorTitle>
                Select {selectorSource === "from" ? "Source" : "Destination"} Token
              </SelectorTitle>
              <SelectorSub>
                {selectorSource === "from"
                  ? "Select IDRX to deposit Rupiah, or pick any stablecoin to swap from your wallet"
                  : "Select IDRX to receive Rupiah to your bank, or pick a stablecoin to receive to your wallet"
                }
              </SelectorSub>
            </SelectorTitleGroup>
            <CloseSelectorBtn onClick={() => setSelectingToken(false)}>
              <X size={13} strokeWidth={2.5} />
            </CloseSelectorBtn>
          </SelectorHeader>

          <SearchWrap>
            <SearchInput
              ref={searchRef}
              placeholder="Search tokens..."
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value)}
            />
            <SearchIconWrap><Search size={14} /></SearchIconWrap>
          </SearchWrap>

          {/* Step 1: token list */}
          {!pendingToken && (
            <TokenList>
              {showIDRX && (
                <>
                  <NetworkSectionLabel>
                    {selectorSource === "from" ? "Supports Minting & Swap" : "Supports Swap & Redeem"}
                  </NetworkSectionLabel>
                  <IDRXListItem
                    $active={selectorSource === "from" ? fromToken.symbol === "IDRX" : toToken.symbol === "IDRX"}
                    onClick={() => handleSelectToken(IDRX_TOKEN)}
                  >
                    <TokenListIcon $bg="#1e4db7">X</TokenListIcon>
                    <TokenListMeta>
                      <TokenListNameRow>IDRX <IDRXBadge>Regulated</IDRXBadge></TokenListNameRow>
                      <TokenListNet $color="#4a6fd4">Indonesian Rupiah Stablecoin</TokenListNet>
                    </TokenListMeta>
                  </IDRXListItem>
                </>
              )}
              <NetworkSectionLabel>Other Stablecoins — Swap Only</NetworkSectionLabel>
              {filteredAllTokens.map((token) => {
                const isCurrent = selectorSource === "from"
                  ? fromToken.symbol === token.symbol && fromToken.symbol !== "IDRX"
                  : toToken.symbol === token.symbol && toToken.symbol !== "IDRX";
                return (
                  <TokenListItem key={token.symbol} $active={isCurrent}
                    onClick={() => handlePendingToken(token)}
                  >
                    {token.icon
                      ? <TokenListImg src={token.icon} alt={token.symbol} />
                      : <TokenListIcon $bg={token.bg}>{token.letter}</TokenListIcon>
                    }
                    <TokenListMeta>
                      <TokenListNameRow>
                        {token.symbol}
                        <TokenListTicker>{token.name}</TokenListTicker>
                      </TokenListNameRow>
                      <TokenListNet $color="#A0ACA8">
                        {getTokenNetworks(token.symbol).map(n => n.label).join(" · ")}
                      </TokenListNet>
                    </TokenListMeta>
                    <ChevronRight size={13} strokeWidth={2} style={{ marginLeft: "auto", color: "#C2CFCB", flexShrink: 0 }} />
                  </TokenListItem>
                );
              })}
              {filteredAllTokens.length === 0 && !showIDRX && (
                <TokenListItem as="div" style={{ cursor: "default", color: "var(--ink-mute)", fontSize: 13 }}>
                  No tokens found
                </TokenListItem>
              )}
            </TokenList>
          )}

          {/* Step 2: network picker */}
          {pendingToken && (
            <>
              <NetworkBackBtn onClick={() => setPendingToken(null)}>
                <ChevronLeft size={14} strokeWidth={2.5} />
                Back to tokens
              </NetworkBackBtn>
              <TokenList>
                <NetworkSectionLabel>Choose Network for {pendingToken.symbol}</NetworkSectionLabel>
                {getTokenNetworks(pendingToken.symbol).map(net => (
                  <NetworkPickItem key={net.id} onClick={() => handleNetworkSelect(net)}>
                    <ChainImg src={net.icon} alt={net.label} />
                    <NetworkPickLabel>{net.label}</NetworkPickLabel>
                  </NetworkPickItem>
                ))}
              </TokenList>
            </>
          )}
        </TokenSelectorOverlay>
      )}

      {/* ── Main swap form ── */}
      <SwapHeader>
        <SwapTitle>Swap</SwapTitle>
        <UserChip>
          {connected ? (
            <>
              <UserEmail>
                {connectMethod === "metamask" ? MOCK_WALLET : "puja.exe@gmail.com"}
              </UserEmail>
              <GoogleBtn aria-label="Account">
                {connectMethod === "metamask" ? METAMASK_SVG(18) : GOOGLE_SVG(16)}
              </GoogleBtn>
            </>
          ) : (
            <SignInLink onClick={openConnectSheet}>Sign in</SignInLink>
          )}
        </UserChip>
      </SwapHeader>

      {/* FROM / TO — both sides always clickable */}
      <TokenRow>
        <TokenColWrap>
          <FieldLabel>From</FieldLabel>
          <TokenBox $clickable onClick={() => { setSelectorSource("from"); setSelectingToken(true); }}>
            {fromToken.icon
              ? <TokenBoxImg src={fromToken.icon} alt={fromToken.symbol} />
              : <TokenCircle $bg={fromToken.bg}>{fromToken.letter}</TokenCircle>
            }
            <TokenInfo>
              <TokenNameRow>{fromToken.symbol} <ChevronDown size={11} strokeWidth={2.5} /></TokenNameRow>
              <TokenSubLine>{fromSubLine}</TokenSubLine>
            </TokenInfo>
          </TokenBox>
        </TokenColWrap>

        <SwapDirBtn onClick={handleFlip} title="Flip direction">
          <ArrowLeftRight size={13} strokeWidth={2.2} />
        </SwapDirBtn>

        <TokenColWrap>
          <FieldLabel>To</FieldLabel>
          <TokenBox $clickable onClick={() => { setSelectorSource("to"); setSelectingToken(true); }}>
            {toToken.icon
              ? <TokenBoxImg src={toToken.icon} alt={toToken.symbol} />
              : <TokenCircle $bg={toToken.bg}>{toToken.letter}</TokenCircle>
            }
            <TokenInfo>
              <TokenNameRow>{toToken.symbol} <ChevronDown size={11} strokeWidth={2.5} /></TokenNameRow>
              <TokenSubLine>{toSubLine}</TokenSubLine>
            </TokenInfo>
          </TokenBox>
        </TokenColWrap>
      </TokenRow>

      {/* SEND */}
      <SectionBlock>
        <FieldLabel>Send</FieldLabel>
        <AmountField>
          {fromToken.icon
            ? <TokenBoxImgSm src={fromToken.icon} alt={fromToken.symbol} />
            : <TokenCircleSm $bg={fromToken.bg}>{fromToken.letter}</TokenCircleSm>
          }
          <AmountInput
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </AmountField>
      </SectionBlock>

      {/* DESTINATION: bank account for offramp, wallet address for onramp/walletswap */}
      {swapMode === "offramp" ? (
        <SectionBlock>
          <FieldLabel>Receiving Account</FieldLabel>
          <ReceivingAccountBox>
            {hasAccount ? (
              <>
                <BankInfo>
                  <BankName>Bank BCA</BankName>
                  <BankAcct>•••• 4512</BankAcct>
                </BankInfo>
                <ChangeAcctBtn onClick={() => setHasAccount(false)}>Change</ChangeAcctBtn>
              </>
            ) : (
              <>
                <NoAccountText>No Account Yet</NoAccountText>
                <AddAccountBtn onClick={() => setHasAccount(true)}>Add Account</AddAccountBtn>
              </>
            )}
          </ReceivingAccountBox>
        </SectionBlock>
      ) : (
        <SectionBlock>
          <FieldLabel>Destination Address</FieldLabel>
          {connectMethod === "metamask" ? (
            <MetamaskAddrField>
              <MetamaskAddrText>{MOCK_WALLET}</MetamaskAddrText>
              <MetamaskBadge>Metamask</MetamaskBadge>
            </MetamaskAddrField>
          ) : (
            <AddressInput
              type="text"
              placeholder="Input wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </SectionBlock>
      )}

      {/* QUOTE */}
      <QuoteMeta>
        <MetaRow>
          <MetaKey>{swapMode === "offramp" ? "You Will Receive" : "Minimum Received"}</MetaKey>
          <MetaVal>{minReceived}</MetaVal>
        </MetaRow>
        <MetaRow>
          <MetaKey>Quote valid for</MetaKey>
          <TimerVal>{connected && amount ? `${timer}s` : "60s"}</TimerVal>
        </MetaRow>
      </QuoteMeta>

      {/* CTA */}
      {!connected ? (
        <ActionBtn onClick={openConnectSheet}>
          <Lock size={15} strokeWidth={2.2} />
          {swapMode === "walletswap" ? "Connect Wallet" : "Connect Account"}
        </ActionBtn>
      ) : (
        <ActionBtn
          onClick={handleSwap}
          $dim={!canSwap || swapStatus === "loading"}
          aria-disabled={!canSwap || swapStatus !== "idle"}
        >
          {swapStatus === "loading" ? (
            <><SpinningIcon size={16} strokeWidth={2} />Processing...</>
          ) : (
            `Swap to ${toToken.symbol}`
          )}
        </ActionBtn>
      )}
    </SwapBox>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
export function Hero() {
  return (
    <HeroSection>
      <Wrap>
        <HeroGrid>

          <HeroContent>
            <FadeUp $delay={0}><Eyebrow>The global self-custodial stablecoin hub</Eyebrow></FadeUp>
            <FadeUp $delay={90}>
              <H1>Move money across borders <em>in minutes.</em><br />The Future Rails for Global Liquidity</H1>
            </FadeUp>
            <FadeUp $delay={180}>
              <Lede>
                One hub connecting regulated issuers, on-chain liquidity, and licensed off-ramps. Faster and cheaper than banks — and your funds stay yours.
              </Lede>
            </FadeUp>
            <FadeUp $delay={260}>
              <HeroCTAs>
                <Button>Get a quote →</Button>
                <Button as="a" href="/contact" $variant="ghost">Talk to our team</Button>
              </HeroCTAs>
            </FadeUp>
            <FadeUp $delay={340}>
              <HeroTrust>
                <span>You own your wallet. Always.</span>
                <span>Stablecoin corridors across Asia.</span>
                <span>Settles before the bank opens.</span>
              </HeroTrust>
            </FadeUp>
          </HeroContent>

          <FadeUp $delay={140}>
            <SwapWidget />
          </FadeUp>

        </HeroGrid>
      </Wrap>
    </HeroSection>
  );
}
