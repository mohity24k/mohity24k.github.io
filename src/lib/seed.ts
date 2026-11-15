/**
 * Deterministic randomness for generated artwork. The same key always gives
 * the same sequence, so a card's cover never changes between builds.
 */
export function seeded(key: string) {
  let h = 1779033703 ^ key.length;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;

  /** A float in [0, 1). */
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    /** A float in [min, max). */
    range: (min: number, max: number) => min + next() * (max - min),
    /** An integer in [min, max]. */
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    /** One element of the list. */
    pick: <T,>(list: readonly T[]): T => list[Math.floor(next() * list.length)]!,
  };
}

export type Rng = ReturnType<typeof seeded>;
