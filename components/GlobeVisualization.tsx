"use client";

import { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import landCoords from "../data/land-dots.json";

const SVGContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SVG = styled.svg`
  width: 100%;
  height: 100%;
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const pulseHalo = keyframes`
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(2.2); }
`;

const GlobeDot = styled.circle<{ $delay?: number }>`
  animation: ${pulseDot} 2.6s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay ?? 0}s;
`;

const GlobeHalo = styled.circle<{ $delay?: number }>`
  transform-box: fill-box;
  transform-origin: center;
  animation: ${pulseHalo} 2.6s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay ?? 0}s;
`;

// Globe projection — must match the params used in gen_land_dots.js
const RADIUS = 160;
const PERSPECTIVE = 700;
const VIEW_LNG = 10; // centers ~100°E (Southeast Asia) on front face

function latLngToXYZ(lat: number, lng: number, r: number = RADIUS) {
  const φ = (lat * Math.PI) / 180;
  const λ = ((lng - VIEW_LNG) * Math.PI) / 180;
  return {
    x: -r * Math.cos(φ) * Math.cos(λ), // negate: East = right
    y: -r * Math.sin(φ),                // negate: North = up
    z:  r * Math.cos(φ) * Math.sin(λ),
  };
}

function project(x: number, y: number, z: number) {
  const s = PERSPECTIVE / (PERSPECTIVE + z);
  return { x: x * s, y: y * s };
}

function visible(z: number) {
  return z > -RADIUS * 0.1;
}

function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const len = Math.sqrt(mx * mx + my * my);
  if (len < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const cpX = mx + (mx / len) * dist * 0.3;
  const cpY = my + (my / len) * dist * 0.3;
  return `M ${x1} ${y1} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${x2} ${y2}`;
}

const cities: Array<{
  name: string; sub?: string;
  lat: number; lng: number;
  primary: boolean;
  dx: number; dy: number;
  anchor?: "start" | "end" | "middle";
}> = [
  { name: "Jakarta",      sub: "Indonesia", lat:  -6.2088, lng: 106.8456, primary: true,  dx:  10, dy:   4 },
  { name: "Singapore",    lat:   1.3521, lng: 103.8198, primary: true,  dx:  10, dy: -10 },
  { name: "Bangkok",      lat:  13.7563, lng: 100.5018, primary: true,  dx:  10, dy:  -9 },
  { name: "Kuala Lumpur", lat:   3.1390, lng: 101.6869, primary: true,  dx:  10, dy:  14 },
  { name: "Ho Chi Minh",  lat:  10.7769, lng: 106.7009, primary: false, dx:  10, dy:   4 },
  { name: "Manila",       lat:  14.5995, lng: 120.9842, primary: false, dx:  10, dy:   4 },
  { name: "Tokyo",        lat:  35.6762, lng: 139.6503, primary: false, dx:  10, dy:   4 },
  { name: "Dubai",        lat:  25.2048, lng:  55.2708, primary: false, dx: -10, dy:   4, anchor: "end" },
];

const routes = [
  { from: "Jakarta",   to: "Singapore"    },
  { from: "Singapore", to: "Bangkok"      },
  { from: "Singapore", to: "Kuala Lumpur" },
  { from: "Bangkok",   to: "Ho Chi Minh"  },
  { from: "Singapore", to: "Manila"       },
  { from: "Singapore", to: "Tokyo"        },
  { from: "Dubai",     to: "Singapore"    },
];

export function GlobeVisualization() {
  // Project pre-computed land [lat, lng] pairs → SVG coordinates
  const landDots = useMemo(() => {
    return (landCoords as [number, number][]).map(([lat, lng]) => {
      const c = latLngToXYZ(lat, lng);
      const p = project(c.x, c.y, c.z);
      const depth = (c.z + RADIUS) / (2 * RADIUS); // 0=limb, 1=center
      return {
        cx: parseFloat(p.x.toFixed(1)),
        cy: parseFloat(p.y.toFixed(1)),
        r:  parseFloat((1.1 + depth * 0.8).toFixed(2)),
        op: parseFloat((0.22 + depth * 0.48).toFixed(2)),
      };
    });
  }, []);

  const cityCoords = cities.map((city) => {
    const xyz = latLngToXYZ(city.lat, city.lng);
    const { x, y } = project(xyz.x, xyz.y, xyz.z);
    return { ...city, ...xyz, px: x, py: y };
  });

  const routeCoords = routes.map((r) => ({
    from: cityCoords.find((c) => c.name === r.from),
    to:   cityCoords.find((c) => c.name === r.to),
  }));

  return (
    <SVGContainer>
      <SVG viewBox="-240 -240 480 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="globeBg" cx="50%" cy="50%">
            <stop offset="0%"   stopColor="oklch(13% 0.02 218)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(6%  0.01 218)"  stopOpacity="1" />
          </radialGradient>
          <filter id="cityGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dark ocean sphere */}
        <circle cx="0" cy="0" r={RADIUS} fill="url(#globeBg)" />

        {/* Land dot field — each dot is a land coordinate */}
        {landDots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="oklch(72% 0.07 196)"
            opacity={d.op}
          />
        ))}

        {/* Settlement route arcs */}
        <g filter="url(#routeGlow)">
          {routeCoords.map((route, idx) => {
            if (!route.from || !route.to) return null;
            if (!visible(route.from.z) || !visible(route.to.z)) return null;
            return (
              <path
                key={`route-${idx}`}
                d={arcPath(route.from.px, route.from.py, route.to.px, route.to.py)}
                fill="none"
                stroke="oklch(82% 0.1 196)"
                strokeWidth="1.2"
                opacity="0.55"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* City markers */}
        <g filter="url(#cityGlow)">
          {cityCoords.map((city, idx) => {
            if (!visible(city.z)) return null;
            const r = city.primary ? 5.5 : 3.5;
            const delay = parseFloat((idx * 0.32).toFixed(2));
            return (
              <g key={city.name}>
                <GlobeHalo cx={city.px} cy={city.py} r={r + 2} fill="oklch(80% 0.1 196)" $delay={delay} />
                <GlobeDot
                  cx={city.px} cy={city.py} r={r}
                  fill={city.primary ? "white" : "oklch(80% 0.1 196)"}
                  $delay={delay}
                />
                <text
                  x={city.px + city.dx}
                  y={city.py + city.dy}
                  textAnchor={city.anchor ?? "start"}
                  fill="white"
                  fontSize={city.primary ? "11" : "10"}
                  fontFamily="var(--sans)"
                  fontWeight={city.primary ? "600" : "400"}
                  opacity={city.primary ? 1 : 0.78}
                >
                  {city.name}
                </text>
                {city.sub && (
                  <text
                    x={city.px + city.dx}
                    y={city.py + city.dy + 13}
                    textAnchor={city.anchor ?? "start"}
                    fill="oklch(65% 0.06 196)"
                    fontSize="9"
                    fontFamily="var(--sans)"
                    opacity="0.7"
                  >
                    {city.sub}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Specular highlight */}
        <ellipse cx="-30" cy="-55" rx="60" ry="70" fill="white" opacity="0.02" />
      </SVG>
    </SVGContainer>
  );
}
