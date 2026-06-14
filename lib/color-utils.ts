// ---- VALIDATE HEX ----
export function isValidHex(hex: string) {
  return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

// ---- HEX → RGB ----
export function hexToRgb(hex: string) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// ---- RGB → HEX ----
export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => v.toString(16).padStart(2, "0").toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ---- RGB → HSV ----
export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;

  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff) % 6;
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  return {
    h,
    s,
    v,
  };
}

// ---- HSV → RGB ----
export function hsvToRgb(h: number, s: number, v: number) {
  const C = (v / 100) * (s / 100);
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v / 100 - C;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) [r, g, b] = [C, X, 0];
  else if (60 <= h && h < 120) [r, g, b] = [X, C, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, C, X];
  else if (180 <= h && h < 240) [r, g, b] = [0, X, C];
  else if (240 <= h && h < 300) [r, g, b] = [X, 0, C];
  else if (300 <= h && h < 360) [r, g, b] = [C, 0, X];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}
