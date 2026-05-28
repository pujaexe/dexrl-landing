"use client";

import React from "react";
import styled from "styled-components";
import { useInView } from "../hooks/useInView";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;   // ms
  y?: number;       // px slide distance
  className?: string;
}

const Box = styled.div<{ $in: boolean; $delay: number; $y: number }>`
  opacity: ${(p) => (p.$in ? 1 : 0)};
  transform: translateY(${(p) => (p.$in ? 0 : p.$y)}px);
  transition:
    opacity  0.72s cubic-bezier(0.22, 1, 0.36, 1) ${(p) => p.$delay}ms,
    transform 0.72s cubic-bezier(0.22, 1, 0.36, 1) ${(p) => p.$delay}ms;
  will-change: opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.3s ease ${(p) => p.$delay}ms;
    transform: none !important;
  }
`;

export function Reveal({ children, delay = 0, y = 30, className }: RevealProps) {
  const { ref, inView } = useInView();
  return (
    <Box
      ref={ref as React.RefObject<HTMLDivElement>}
      $in={inView}
      $delay={delay}
      $y={y}
      className={className}
    >
      {children}
    </Box>
  );
}
