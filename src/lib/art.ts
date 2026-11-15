/**
 * Geometry for the generated cover artwork. Pure functions: a seed goes in,
 * shapes in a 400 × 250 box come out. CoverArt.astro turns them into SVG.
 *
 * This artwork stands in wherever an entry has no cover image yet. It is
 * illustration, not data: nothing here encodes a result.
 */
import type { Rng } from './seed';

export const ART_W = 400;
export const ART_H = 250;

const rad = (deg: number) => (deg * Math.PI) / 180;
const round = (n: number) => Math.round(n * 10) / 10;

/* ── Lab: skeletal formulas ─────────────────────────────────────────────────
   Three real, familiar molecules drawn as a chemist would: paracetamol,
   aspirin and ibuprofen. Hand-specified so the chemistry is right; the seed
   only chooses which one a card gets.                                       */

interface Atom {
  x: number;
  y: number;
  label?: string;
  /** Which side of the label sits on the atom. */
  anchor?: 'start' | 'middle' | 'end';
  /** Draw a small H under the label (for N–H). */
  hBelow?: boolean;
}

interface Bond {
  a: number;
  b: number;
  double?: 'center' | 'inner';
}

class Molecule {
  atoms: Atom[] = [];
  bonds: Bond[] = [];

  /** A benzene ring of unit radius at the origin, vertices at 0°, 60°, … 300°. */
  ring(): number[] {
    const ids = [0, 1, 2, 3, 4, 5].map((k) => this.atoms.push({ x: Math.cos(rad(k * 60)), y: Math.sin(rad(k * 60)) }) - 1);
    ids.forEach((id, k) => this.bonds.push({ a: id, b: ids[(k + 1) % 6]!, double: k % 2 === 0 ? 'inner' : undefined }));
    return ids;
  }

  /** Add an atom one bond length from `from`, in the direction `deg` (screen degrees, 0° = right, 90° = down). */
  grow(from: number, deg: number, opts: Partial<Pick<Atom, 'label' | 'anchor' | 'hBelow'>> & { double?: boolean } = {}): number {
    const origin = this.atoms[from]!;
    const { double, ...atom } = opts;
    const id = this.atoms.push({ x: origin.x + Math.cos(rad(deg)), y: origin.y + Math.sin(rad(deg)), ...atom }) - 1;
    this.bonds.push({ a: from, b: id, double: double ? 'center' : undefined });
    return id;
  }
}

const MOLECULES: Array<{ name: string; formula: string; build: () => Molecule }> = [
  // HO–C6H4–NH–C(=O)–CH3
  { name: 'Paracetamol', formula: 'C8H9NO2', build: () => {
    const m = new Molecule();
    const r = m.ring();
    m.grow(r[3]!, 180, { label: 'HO', anchor: 'end' });
    const n = m.grow(r[0]!, 0, { label: 'N', hBelow: true });
    const c = m.grow(n, 300);
    m.grow(c, 240, { label: 'O', double: true });
    m.grow(c, 0);
    return m;
  } },
  // 2-acetoxybenzoic acid
  { name: 'Aspirin', formula: 'C9H8O4', build: () => {
    const m = new Molecule();
    const r = m.ring();
    const acid = m.grow(r[4]!, 240);
    m.grow(acid, 180, { label: 'O', double: true });
    m.grow(acid, 300, { label: 'OH', anchor: 'start' });
    const ester = m.grow(r[5]!, 300, { label: 'O' });
    const c = m.grow(ester, 0);
    m.grow(c, 300, { label: 'O', double: true });
    m.grow(c, 60);
    return m;
  } },
  // 2-(4-isobutylphenyl)propanoic acid
  { name: 'Ibuprofen', formula: 'C13H18O2', build: () => {
    const m = new Molecule();
    const r = m.ring();
    const ch2 = m.grow(r[3]!, 180);
    const ch = m.grow(ch2, 240);
    m.grow(ch, 180);
    m.grow(ch, 300);
    const alpha = m.grow(r[0]!, 0);
    m.grow(alpha, 300);
    const acid = m.grow(alpha, 60);
    m.grow(acid, 120, { label: 'O', double: true });
    m.grow(acid, 0, { label: 'OH', anchor: 'start' });
    return m;
  } },
];

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Label {
  x: number;
  y: number;
  text: string;
  anchor: 'start' | 'middle' | 'end';
  small?: boolean;
}

/** A molecule fitted into the given box, as bond lines and atom labels. */
export function molecule(
  rng: Rng,
  box = { x: 70, y: 28, w: 300, h: 194 },
): { lines: Line[]; labels: Label[]; name: string; formula: string } {
  const { name, formula, build } = rng.pick(MOLECULES);
  const m = build();

  // Fit: uniform scale, centred, with room for labels at the edges.
  const xs = m.atoms.map((a) => a.x);
  const ys = m.atoms.map((a) => a.y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const pad = 22;
  const bond = Math.min(36, (box.w - 2 * pad) / (maxX - minX), (box.h - 2 * pad) / (maxY - minY));
  const ox = box.x + box.w / 2 - ((minX + maxX) / 2) * bond;
  const oy = box.y + box.h / 2 - ((minY + maxY) / 2) * bond;
  const px = (a: Atom) => ({ x: ox + a.x * bond, y: oy + a.y * bond });

  const lines: Line[] = [];
  const gap = 10; // clear space around a labelled atom

  for (const { a, b, double } of m.bonds) {
    const A = m.atoms[a]!;
    const B = m.atoms[b]!;
    const p = px(A);
    const q = px(B);
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    const ux = (q.x - p.x) / len;
    const uy = (q.y - p.y) / len;
    const start = A.label ? gap : 0;
    const end = B.label ? gap : 0;
    const seg = (off: number, trim = 0): Line => ({
      x1: round(p.x + ux * (start + trim) - uy * off),
      y1: round(p.y + uy * (start + trim) + ux * off),
      x2: round(q.x - ux * (end + trim) - uy * off),
      y2: round(q.y - uy * (end + trim) + ux * off),
    });

    if (double === 'center') {
      lines.push(seg(2.6), seg(-2.6));
    } else if (double === 'inner') {
      // Second line sits inside the ring, towards its centre (the origin).
      const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
      const inward = -uy * -mid.x + ux * -mid.y > 0 ? 1 : -1;
      lines.push(seg(0), seg(inward * 5.2, len * 0.14));
    } else {
      lines.push(seg(0));
    }
  }

  const labels: Label[] = [];
  for (const atom of m.atoms) {
    if (!atom.label) continue;
    const p = px(atom);
    const anchor = atom.anchor ?? 'middle';
    const shift = anchor === 'start' ? -6 : anchor === 'end' ? 6 : 0;
    labels.push({ x: round(p.x + shift), y: round(p.y), text: atom.label, anchor });
    if (atom.hBelow) labels.push({ x: round(p.x), y: round(p.y + 15), text: 'H', anchor: 'middle', small: true });
  }

  return { lines, labels, name, formula };
}

/* ── Lab: network schematic ─────────────────────────────────────────────── */

export interface Node {
  x: number;
  y: number;
  on: boolean;
}

/** Layers of nodes joined to the next layer: a schematic of a model, not a specific one. */
export function network(rng: Rng): { nodes: Node[]; edges: Line[] } {
  const sizes = rng.pick([
    [3, 5, 4, 2],
    [4, 5, 3, 1],
    [2, 4, 5, 3],
    [3, 4, 4, 2],
  ] as const);
  const left = 96;
  const right = 352;
  const layers = sizes.map((count, i) => {
    const x = left + ((right - left) * i) / (sizes.length - 1);
    const spacing = 38;
    const top = ART_H / 2 - ((count - 1) * spacing) / 2;
    return Array.from({ length: count }, (_, k) => ({ x: round(x), y: round(top + k * spacing), on: rng.next() < 0.3 }));
  });

  const edges: Line[] = [];
  layers.slice(0, -1).forEach((layer, i) => {
    for (const a of layer) for (const b of layers[i + 1]!) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  });

  return { nodes: layers.flat(), edges };
}

/* ── Lab: waveform schematic ────────────────────────────────────────────── */

/** Mirrored bars under a few soft bursts, like speech on an audio track. */
export function waveform(rng: Rng): Line[] {
  const bars = 58;
  const left = 74;
  const right = 376;
  // Bursts are spread along the track (one per slot, jittered) so the line never sits empty.
  const count = rng.int(4, 5);
  const bursts = Array.from({ length: count }, (_, i) => ({
    centre: (i + rng.range(0.25, 0.75)) / count,
    width: rng.range(0.04, 0.09),
    height: rng.range(0.45, 1),
  }));

  return Array.from({ length: bars }, (_, i) => {
    const t = i / (bars - 1);
    const envelope = Math.min(1, bursts.reduce((sum, b) => sum + b.height * Math.exp(-(((t - b.centre) / b.width) ** 2)), 0));
    const half = 3 + envelope * rng.range(0.45, 1) * 78;
    const x = round(left + t * (right - left));
    return { x1: x, y1: round(ART_H / 2 - half), x2: x, y2: round(ART_H / 2 + half) };
  });
}

/* ── Studio: a night scene in layers ────────────────────────────────────── */

export interface Scene {
  disc: { x: number; y: number; r: number };
  stars: { x: number; y: number; r: number; o: number }[];
  /** Back to front. Each is a closed SVG path. */
  ridges: string[];
}

export function scene(rng: Rng): Scene {
  const disc = { x: round(rng.range(110, 300)), y: round(rng.range(78, 112)), r: round(rng.range(34, 50)) };

  const stars = Array.from({ length: 34 }, () => ({
    x: round(rng.range(0, ART_W)),
    y: round(rng.range(0, 150)),
    r: round(rng.range(0.5, 1.5)),
    o: round(rng.range(0.25, 0.9)),
  }));

  // Three ridgelines. Further ones are higher, smoother; nearer ones lower, more jagged.
  const ridges = [0, 1, 2].map((layer) => {
    const base = 150 + layer * 30;
    const rough = 14 + layer * 9;
    const step = 46 - layer * 10;
    let d = `M0 ${ART_H} L0 ${round(base + rng.range(-rough, rough))}`;
    for (let x = step; x < ART_W + step; x += step) {
      const y = base + rng.range(-rough, rough);
      d += ` L${round(x - step / 2)} ${round(y - rng.range(2, rough))} L${round(x)} ${round(y)}`;
    }
    return `${d} L${ART_W} ${ART_H} Z`;
  });

  return { disc, stars, ridges };
}
