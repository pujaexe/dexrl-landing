"use client";

import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { X, ArrowRight, Check } from "lucide-react";

/* ── Animations ── */
const backdropIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const modalIn = keyframes`
  from { opacity: 0; transform: translateY(22px) scale(0.97); }
  to   { opacity: 1; transform: none; }
`;
const successIn = keyframes`
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: none; }
`;

/* ── Shell ── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 12, 0.70);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${backdropIn} 0.2s ease;
`;

const Card = styled.div`
  background: var(--bg-elev);
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  max-width: 880px;
  max-height: 92vh;
  display: grid;
  grid-template-columns: 300px 1fr;
  animation: ${modalIn} 0.30s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow:
    0 0 0 1px rgba(0,33,22,0.08),
    0 32px 80px rgba(0, 20, 12, 0.52);

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    max-height: 96vh;
    overflow-y: auto;
  }
`;

/* ── Left panel ── */
const Left = styled.div`
  background: var(--bg-deep);
  color: #ECF0EF;
  padding: 48px 36px;
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (max-width: 680px) {
    padding: 28px 24px 20px;
  }
`;

const LeftTitle = styled.h2`
  font-family: var(--serif);
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.018em;
  color: #ECF0EF;
  margin: 0 0 36px;

  em { font-style: italic; color: #CBF23D; }

  @media (max-width: 680px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;

  @media (max-width: 680px) {
    display: none;
  }
`;

const Step = styled.div`
  display: flex;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(236,240,239,0.08);

  &:last-child { border-bottom: none; }
`;

const StepNum = styled.div`
  font-family: var(--serif);
  font-style: italic;
  font-size: 20px;
  color: #CBF23D;
  flex-shrink: 0;
  line-height: 1.25;
  width: 28px;
`;

const StepBody = styled.div``;

const StepTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #ECF0EF;
  margin-bottom: 4px;
`;

const StepDesc = styled.div`
  font-size: 13px;
  line-height: 1.55;
  color: rgba(236,240,239,0.55);
`;

const LeftFooter = styled.p`
  font-size: 12px;
  color: rgba(236,240,239,0.32);
  margin: 28px 0 0;
  line-height: 1.55;

  @media (max-width: 680px) { display: none; }
`;

/* ── Right panel ── */
const Right = styled.div`
  overflow-y: auto;
  padding: 36px 40px 36px;
  position: relative;

  @media (max-width: 680px) {
    padding: 24px 20px 28px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink-mute);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover { background: var(--line); color: var(--ink); }
`;

const FormTitle = styled.h3`
  font-family: var(--serif);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 0 0 24px;
  padding-right: 40px;
`;

/* ── Form elements ── */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-soft);
  letter-spacing: 0.01em;

  span { color: var(--ink-mute); font-weight: 400; }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 13px;
  background: var(--bg);
  border: 1.5px solid var(--line-soft);
  border-radius: 9px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: var(--ink-mute); }
  &:focus { border-color: var(--line); }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 13px;
  background: var(--bg);
  border: 1.5px solid var(--line-soft);
  border-radius: 9px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--ink);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236A9080' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 13px center;
  transition: border-color 0.15s;

  &:focus { border-color: var(--line); }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 13px;
  background: var(--bg);
  border: 1.5px solid var(--line-soft);
  border-radius: 9px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--ink);
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s;

  &::placeholder { color: var(--ink-mute); }
  &:focus { border-color: var(--line); }
`;

/* ── Segmented / pill selectors ── */
const PillGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Pill = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13.5px;
  font-family: var(--sans);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  border: 1.5px solid ${(p) => p.$active ? "var(--accent)" : "var(--line)"};
  background: ${(p) => p.$active ? "var(--accent-soft)" : "var(--bg-elev)"};
  color: ${(p) => p.$active ? "var(--ink)" : "var(--ink-soft)"};
  font-weight: ${(p) => p.$active ? "600" : "400"};
`;

/* ── Checkbox ── */
const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const CheckBox = styled.input`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  accent-color: var(--accent);
  cursor: pointer;
`;

const CheckText = styled.span`
  font-size: 12.5px;
  color: var(--ink-soft);
  line-height: 1.55;
`;

/* ── Submit ── */
const SubmitBtn = styled.button<{ $disabled: boolean }>`
  width: 100%;
  padding: 13px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--sans);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: ${(p) => p.$disabled ? "not-allowed" : "pointer"};
  background: ${(p) => p.$disabled ? "var(--line)" : "var(--accent)"};
  color: ${(p) => p.$disabled ? "var(--ink-mute)" : "var(--on-accent)"};
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: ${(p) => p.$disabled ? "none" : "0 0 22px rgba(203,242,61,0.30)"};

  &:hover:not(:disabled) {
    background: ${(p) => p.$disabled ? "var(--line)" : "#b8d934"};
    transform: ${(p) => p.$disabled ? "none" : "translateY(-1px)"};
  }
`;

/* ── Success state ── */
const SuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 320px;
  gap: 16px;
  animation: ${successIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1);
`;

const SuccessIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--on-accent);
  display: grid;
  place-items: center;
`;

const SuccessTitle = styled.h3`
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 400;
  color: var(--ink);
  margin: 0;
`;

const SuccessDesc = styled.p`
  font-size: 15px;
  color: var(--ink-soft);
  max-width: 36ch;
  line-height: 1.6;
  margin: 0;
`;

/* ── Two-col row ── */
const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

/* ═══════════════════════════════════ COMPONENT ═══════════════════════════════════ */

interface FormState {
  intent: "send" | "partner";
  corridor: string;
  type: "individual" | "company";
  name: string;
  email: string;
  phone: string;
  message: string;
  agreed: boolean;
}

const INITIAL: FormState = {
  intent: "send",
  corridor: "",
  type: "individual",
  name: "",
  email: "",
  phone: "",
  message: "",
  agreed: false,
};

export function ContactModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Listen for trigger event from any button on the page */
  useEffect(() => {
    const handler = () => { setOpen(true); setSubmitted(false); setForm(INITIAL); };
    window.addEventListener("dexrl:contact", handler);
    return () => window.removeEventListener("dexrl:contact", handler);
  }, []);

  /* Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canSubmit = form.name.trim() && form.email.trim() && form.corridor && form.agreed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <Overlay ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}>
      <Card onClick={(e) => e.stopPropagation()}>

        {/* ── Left ── */}
        <Left>
          <LeftTitle>The team is <em>here.</em></LeftTitle>
          <Steps>
            <Step>
              <StepNum>01</StepNum>
              <StepBody>
                <StepTitle>Tell us what you need</StepTitle>
                <StepDesc>Send a payment, explore a corridor, or connect as a partner. We'll route the conversation.</StepDesc>
              </StepBody>
            </Step>
            <Step>
              <StepNum>02</StepNum>
              <StepBody>
                <StepTitle>Get a live quote</StepTitle>
                <StepDesc>Rate locked before you commit. One fee shown upfront — no hidden margin.</StepDesc>
              </StepBody>
            </Step>
            <Step>
              <StepNum>03</StepNum>
              <StepBody>
                <StepTitle>Settle in minutes</StepTitle>
                <StepDesc>Funds reach the recipient before the bank opens.</StepDesc>
              </StepBody>
            </Step>
          </Steps>
          <LeftFooter>dexRL is a routing layer. We never hold your funds — licensed partners do the compliance at each end.</LeftFooter>
        </Left>

        {/* ── Right ── */}
        <Right>
          <CloseBtn onClick={() => setOpen(false)} aria-label="Close">
            <X size={15} strokeWidth={2} />
          </CloseBtn>

          {submitted ? (
            <SuccessWrap>
              <SuccessIcon><Check size={26} strokeWidth={2} /></SuccessIcon>
              <SuccessTitle>We&apos;ll be in touch.</SuccessTitle>
              <SuccessDesc>Your message is with the team. Expect a reply within one business day.</SuccessDesc>
            </SuccessWrap>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <FormTitle>Start a conversation</FormTitle>

              {/* Intent */}
              <FieldGroup>
                <Label>What are you looking to do?</Label>
                <PillGroup>
                  <Pill type="button" $active={form.intent === "send"} onClick={() => set("intent", "send")}>
                    Send a payment
                  </Pill>
                  <Pill type="button" $active={form.intent === "partner"} onClick={() => set("intent", "partner")}>
                    Partner with dexRL
                  </Pill>
                </PillGroup>
              </FieldGroup>

              {/* Corridor */}
              <FieldGroup>
                <Label>Which corridor? *</Label>
                <Select value={form.corridor} onChange={(e) => set("corridor", e.target.value)} required>
                  <option value="" disabled>Select a corridor</option>
                  <option value="id-sg">Indonesia → Singapore</option>
                  <option value="id-uk">Indonesia → United Kingdom</option>
                  <option value="multi">Multiple corridors</option>
                  <option value="other">Not sure yet</option>
                </Select>
              </FieldGroup>

              {/* Individual / Company */}
              <FieldGroup>
                <Label>You are enquiring as:</Label>
                <PillGroup>
                  <Pill type="button" $active={form.type === "individual"} onClick={() => set("type", "individual")}>
                    An individual
                  </Pill>
                  <Pill type="button" $active={form.type === "company"} onClick={() => set("type", "company")}>
                    A company
                  </Pill>
                </PillGroup>
              </FieldGroup>

              {/* Name + Email */}
              <Row2>
                <FieldGroup>
                  <Label>Name *</Label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                    autoComplete="name"
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label>Work email *</Label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                    autoComplete="email"
                  />
                </FieldGroup>
              </Row2>

              {/* Phone */}
              <FieldGroup>
                <Label>Phone <span>(optional)</span></Label>
                <Input
                  type="tel"
                  placeholder="+62 ..."
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                />
              </FieldGroup>

              {/* Message */}
              <FieldGroup>
                <Label>Message <span>(optional)</span></Label>
                <Textarea
                  placeholder="Tell us more — volumes, timelines, use case…"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </FieldGroup>

              {/* Checkbox */}
              <CheckRow>
                <CheckBox
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => set("agreed", e.target.checked)}
                />
                <CheckText>I agree to be contacted by dexRL regarding this enquiry. No spam — ever.</CheckText>
              </CheckRow>

              <SubmitBtn type="submit" $disabled={!canSubmit} disabled={!canSubmit}>
                Send message <ArrowRight size={15} strokeWidth={2.2} />
              </SubmitBtn>
            </form>
          )}
        </Right>

      </Card>
    </Overlay>
  );
}
