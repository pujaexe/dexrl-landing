"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* ── Animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
`;

/* ── Page shell ── */
const PageWrap = styled.div`
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 140px 32px 100px;

  @media (max-width: 820px) {
    padding: 120px 20px 60px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

/* ══════════════ LEFT SIDE ══════════════ */
const LeftCol = styled.div`
  animation: ${fadeUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: 20px;
  font-family: var(--sans);
`;

const PageTitle = styled.h1`
  font-family: var(--serif);
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.022em;
  color: var(--ink);
  margin: 0 0 52px;
  text-wrap: balance;

  em { font-style: italic; color: var(--accent-em); }
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
`;

const StepRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 0;
  padding: 28px 0;
  position: relative;

  /* vertical connector line */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 68px;
    bottom: 0;
    width: 1px;
    background: var(--line-soft);
  }
`;

const StepNumber = styled.div`
  font-family: var(--serif);
  font-style: italic;
  font-size: 38px;
  font-weight: 400;
  color: var(--accent-em);
  line-height: 1;
  padding-top: 4px;
`;

const StepContent = styled.div``;

const StepTitle = styled.h3`
  font-weight: 700;
  font-size: 17px;
  color: var(--ink);
  margin: 0 0 6px;
  letter-spacing: -0.01em;
`;

const StepDesc = styled.p`
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.6;
  margin: 0;
`;

/* Decorative pill stats at the bottom */
const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 52px;
`;

const StatPill = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: 7px;

  strong {
    color: var(--ink);
    font-weight: 600;
  }

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }
`;

/* ══════════════ RIGHT SIDE — FORM ══════════════ */
const RightCol = styled.div`
  animation: ${fadeUp} 0.6s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const FormCard = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow: var(--shadow-2);

  @media (max-width: 480px) {
    padding: 28px 20px;
  }
`;

const FormTitle = styled.h2`
  font-family: var(--serif);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 0 0 28px;
`;

/* ── Field primitives ── */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: 0.005em;

  span {
    color: var(--ink-mute);
    font-weight: 400;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  background: var(--bg);
  border: 1.5px solid var(--line-soft);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;

  &::placeholder { color: var(--ink-mute); }
  &:focus { border-color: var(--line); }
`;

const Select = styled.select`
  width: 100%;
  padding: 11px 14px;
  background: var(--bg);
  border: 1.5px solid var(--line-soft);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--ink);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236A9080' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  transition: border-color 0.15s;
  box-sizing: border-box;

  &:focus { border-color: var(--line); }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  background: var(--bg);
  border: 1.5px solid var(--line-soft);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--sans);
  color: var(--ink);
  outline: none;
  resize: vertical;
  min-height: 90px;
  transition: border-color 0.15s;
  box-sizing: border-box;

  &::placeholder { color: var(--ink-mute); }
  &:focus { border-color: var(--line); }
`;

/* ── Radio group ── */
const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const RadioPill = styled.label<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-family: var(--sans);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1.5px solid ${(p) => p.$active ? "var(--accent)" : "var(--line)"};
  background: ${(p) => p.$active ? "var(--accent-soft)" : "var(--bg-elev)"};
  color: ${(p) => p.$active ? "var(--ink)" : "var(--ink-soft)"};
  font-weight: ${(p) => p.$active ? "600" : "400"};
  user-select: none;

  input { display: none; }
`;

/* ── 2-col row ── */
const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Divider ── */
const Divider = styled.div`
  height: 1px;
  background: var(--line-soft);
  margin: 8px 0 18px;
`;

/* ── Checkbox ── */
const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 22px;
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
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.6;
`;

/* ── Submit ── */
const SubmitBtn = styled.button<{ $ready: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--sans);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${(p) => p.$ready ? "pointer" : "not-allowed"};
  background: ${(p) => p.$ready ? "var(--accent)" : "var(--line)"};
  color: ${(p) => p.$ready ? "var(--on-accent)" : "var(--ink-mute)"};
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: ${(p) => p.$ready ? "0 0 24px rgba(203,242,61,0.32)" : "none"};

  &:hover {
    background: ${(p) => p.$ready ? "#b8d934" : "var(--line)"};
    transform: ${(p) => p.$ready ? "translateY(-1px)" : "none"};
  }
`;

/* ── Success state ── */
const SuccessCard = styled.div`
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 64px 36px;
  box-shadow: var(--shadow-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  animation: ${fadeUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const SuccessCheck = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--on-accent);
  display: grid;
  place-items: center;
`;

const SuccessTitle = styled.h2`
  font-family: var(--serif);
  font-size: 26px;
  font-weight: 400;
  color: var(--ink);
  margin: 0;
`;

const SuccessDesc = styled.p`
  font-size: 15px;
  color: var(--ink-soft);
  max-width: 34ch;
  line-height: 1.6;
  margin: 0;
`;

const BackLink = styled.a`
  font-size: 14px;
  color: var(--ink-mute);
  text-decoration: underline;
  text-underline-offset: 3px;
  margin-top: 8px;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: var(--ink); }
`;

/* ══════════════ DATA ══════════════ */
const steps = [
  {
    num: "01",
    title: "Talk to our team",
    desc: "Describe what you need — payment, corridor, or partnership. We'll route you to the right person.",
  },
  {
    num: "02",
    title: "Get a live quote",
    desc: "Rate locked in real time before you commit. One fee shown upfront — no hidden margin.",
  },
  {
    num: "03",
    title: "Funds delivered safely",
    desc: "Settlement completes before the bank opens. Neither party touches a wallet or a chain.",
  },
];

interface Form {
  intent: "send" | "receive";
  currency: string;
  type: "individual" | "company";
  name: string;
  email: string;
  phone: string;
  message: string;
  agreed: boolean;
}

const EMPTY: Form = {
  intent: "send",
  currency: "",
  type: "individual",
  name: "",
  email: "",
  phone: "",
  message: "",
  agreed: false,
};

/* ══════════════ COMPONENT ══════════════ */
export default function ContactPage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof Form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const ready = !!(form.name.trim() && form.email.trim() && form.currency && form.agreed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setSubmitted(true);
  };

  return (
    <PageWrap>
      <Header forceScrolled />

      <Main>
        <Container>

          {/* ── Left ── */}
          <LeftCol>
            <Eyebrow>Talk to our team</Eyebrow>
            <PageTitle>
              Your first transfer,<br /><em>step by step.</em>
            </PageTitle>

            <StepList>
              {steps.map((s) => (
                <StepRow key={s.num}>
                  <StepNumber>{s.num}</StepNumber>
                  <StepContent>
                    <StepTitle>{s.title}</StepTitle>
                    <StepDesc>{s.desc}</StepDesc>
                  </StepContent>
                </StepRow>
              ))}
            </StepList>

            <StatRow>
              <StatPill><strong>&lt; 10 min</strong> settlement</StatPill>
              <StatPill><strong>0.6–1.1%</strong> total fee</StatPill>
              <StatPill><strong>Non-custodial</strong> always</StatPill>
            </StatRow>
          </LeftCol>

          {/* ── Right ── */}
          <RightCol>
            {submitted ? (
              <SuccessCard>
                <SuccessCheck><Check size={26} strokeWidth={2} /></SuccessCheck>
                <SuccessTitle>We&apos;ll be in touch.</SuccessTitle>
                <SuccessDesc>Your message is with the team. Expect a reply within one business day.</SuccessDesc>
                <BackLink href="/">← Back to home</BackLink>
              </SuccessCard>
            ) : (
              <FormCard>
                <FormTitle>Submit your request</FormTitle>

                <form onSubmit={handleSubmit} noValidate>

                  {/* Intent */}
                  <FieldGroup>
                    <Label>Transaction type *</Label>
                    <RadioGroup>
                      <RadioPill $active={form.intent === "send"}>
                        <input type="radio" name="intent" checked={form.intent === "send"} onChange={() => set("intent", "send")} />
                        Send
                      </RadioPill>
                      <RadioPill $active={form.intent === "receive"}>
                        <input type="radio" name="intent" checked={form.intent === "receive"} onChange={() => set("intent", "receive")} />
                        Receive
                      </RadioPill>
                    </RadioGroup>
                  </FieldGroup>

                  {/* Currency */}
                  <FieldGroup>
                    <Label>Currency *</Label>
                    <Select
                      value={form.currency}
                      onChange={(e) => set("currency", e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a currency</option>
                      <option value="usdt">USDT</option>
                      <option value="usdc">USDC</option>
                      <option value="idr">IDR – Rupiah</option>
                      <option value="sgd">SGD – Singapore Dollar</option>
                      <option value="gbp">GBP – British Pound</option>
                      <option value="usd">USD – US Dollar</option>
                      <option value="other">Other</option>
                    </Select>
                  </FieldGroup>

                  {/* Individual / Company */}
                  <FieldGroup>
                    <Label>Are you trading as:</Label>
                    <RadioGroup>
                      <RadioPill $active={form.type === "individual"}>
                        <input type="radio" name="type" checked={form.type === "individual"} onChange={() => set("type", "individual")} />
                        Individual
                      </RadioPill>
                      <RadioPill $active={form.type === "company"}>
                        <input type="radio" name="type" checked={form.type === "company"} onChange={() => set("type", "company")} />
                        Company
                      </RadioPill>
                    </RadioGroup>
                  </FieldGroup>

                  <Divider />

                  {/* Name + Email */}
                  <Row2>
                    <FieldGroup>
                      <Label>Contact name *</Label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        autoComplete="name"
                        required
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </FieldGroup>
                  </Row2>

                  {/* Phone */}
                  <FieldGroup>
                    <Label>Phone number <span>(optional)</span></Label>
                    <Input
                      type="tel"
                      placeholder="+62 812 …"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      autoComplete="tel"
                    />
                  </FieldGroup>

                  {/* Message */}
                  <FieldGroup>
                    <Label>Notes <span>(optional)</span></Label>
                    <Textarea
                      placeholder="Additional information — volumes, timelines, use case…"
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
                    <CheckText>
                      I agree to be contacted by dexRL regarding this enquiry. No spam, ever.
                    </CheckText>
                  </CheckRow>

                  <SubmitBtn type="submit" $ready={ready} disabled={!ready}>
                    Send <ArrowRight size={15} strokeWidth={2.2} />
                  </SubmitBtn>

                </form>
              </FormCard>
            )}
          </RightCol>

        </Container>
      </Main>

      <Footer />
    </PageWrap>
  );
}
