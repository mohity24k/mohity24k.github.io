#!/usr/bin/env node
// Checks WCAG 2.x contrast for every world's colour tokens.
//   npm run check:contrast
// Reads src/styles/tokens.css, so there is no second list of colours to keep
// in sync. Exits non-zero if any pair is below its threshold.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url)), 'utf8');

const WORLDS = ['neutral', 'lab', 'studio', 'journal'];

// [foreground, background, minimum ratio, what the pair is used for]
const PAIRS = [
  ['ink', 'bg', 4.5, 'body text'],
  ['ink', 'bg-raised', 4.5, 'body text on cards'],
  ['ink', 'bg-sunken', 4.5, 'body text on inset areas'],
  ['ink-soft', 'bg', 4.5, 'secondary text'],
  ['ink-soft', 'bg-raised', 4.5, 'secondary text on cards'],
  ['ink-soft', 'bg-sunken', 4.5, 'secondary text on inset areas'],
  ['ink-faint', 'bg', 3, 'large or non-essential text only'],
  ['accent-text', 'bg', 4.5, 'links and accent text'],
  ['accent-text', 'bg-raised', 4.5, 'links on cards'],
  ['accent-text', 'accent-soft', 4.5, 'text on tinted chips'],
  ['ink', 'accent-soft', 4.5, 'ink on tinted chips'],
  ['accent-ink', 'accent', 4.5, 'text on filled buttons'],
  ['line-strong', 'bg', 3, 'control borders'],
  ['line-strong', 'bg-raised', 3, 'control borders on cards'],
  ['focus', 'bg', 3, 'focus ring'],
  ['focus', 'bg-raised', 3, 'focus ring on cards'],
];

/** Pull `--name: oklch(L% C H)` declarations out of one world's rule block. */
function tokensFor(world) {
  const start = css.indexOf(`[data-world='${world}'] {`);
  if (start === -1) throw new Error(`No [data-world='${world}'] block in tokens.css`);
  const block = css.slice(start, css.indexOf('\n}', start));
  const out = {};
  for (const m of block.matchAll(/--([\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)\s*;/g)) {
    out[m[1]] = { l: +m[2] / 100, c: +m[3], h: +m[4] };
  }
  return out;
}

/** OKLCH → linear sRGB (clipped to gamut). */
function toLinearRgb({ l, c, h }) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

const luminance = (colour) => {
  const [r, g, b] = toLinearRgb(colour);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failures = 0;
for (const world of WORLDS) {
  const t = tokensFor(world);
  console.log(`\n${world}`);
  for (const [fg, bg, min, use] of PAIRS) {
    if (!t[fg] || !t[bg]) {
      console.log(`  MISSING  --${fg} or --${bg}`);
      failures++;
      continue;
    }
    const ratio = contrast(t[fg], t[bg]);
    const ok = ratio >= min;
    if (!ok) failures++;
    console.log(
      `  ${ok ? 'pass' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min})  --${fg} on --${bg}  · ${use}`,
    );
  }
}

console.log(failures ? `\n${failures} contrast check(s) failed.` : '\nAll contrast checks passed.');
process.exit(failures ? 1 : 0);
