/**
 * Motion: the always-loaded half. Small on purpose.
 *
 * - Tells the next page which world we are leaving, so page transitions can
 *   differ between "into the Studio" and "around the Studio" (motion.css).
 * - Drives the Journal's reading-progress bar (plain scroll maths, so it
 *   also works with "reduce motion" on: it follows the reader, it does not
 *   animate by itself).
 * - Loads the GSAP half when the browser is idle, and only if the visitor
 *   has not asked for reduced motion.
 */
import type { TransitionBeforeSwapEvent } from 'astro:transitions/client';

const calm = matchMedia('(prefers-reduced-motion: reduce)');
const root = () => document.documentElement;

let gsapHalf: typeof import('./motion-gsap') | undefined;
let transitionDone: Promise<unknown> = Promise.resolve();

document.addEventListener('astro:before-swap', (event) => {
  const { newDocument, viewTransition } = event as TransitionBeforeSwapEvent;
  const next = newDocument.documentElement;
  next.dataset.fromWorld = root().dataset.world ?? 'neutral';
  if (!calm.matches) next.dataset.motion = 'pending';
  // A skipped or interrupted transition rejects; that must not turn motion off.
  transitionDone = (viewTransition?.finished ?? Promise.resolve()).catch(() => undefined);
  gsapHalf?.stop();
});

/* ── Reading progress ─────────────────────────────────────────────────────── */
let article: HTMLElement | null = null;
let bar: HTMLElement | null = null;
let ticking = false;

function measure() {
  ticking = false;
  if (!article || !bar) return;
  const { top, height } = article.getBoundingClientRect();
  const distance = Math.max(1, height - innerHeight);
  bar.style.setProperty('--progress', String(Math.min(1, Math.max(0, -top / distance))));
}

addEventListener(
  'scroll',
  () => {
    if (!article || ticking) return;
    ticking = true;
    requestAnimationFrame(measure);
  },
  { passive: true },
);
addEventListener('resize', measure);

/* ── Each page ────────────────────────────────────────────────────────────── */
const whenIdle = (work: () => void) =>
  'requestIdleCallback' in window ? requestIdleCallback(work, { timeout: 1200 }) : setTimeout(work, 200);

document.addEventListener('astro:page-load', () => {
  article = document.querySelector<HTMLElement>('[data-reading]');
  bar = document.querySelector<HTMLElement>('[data-progress]');
  measure();

  if (calm.matches) {
    root().dataset.motion = 'off';
    return;
  }

  whenIdle(async () => {
    try {
      // Let the page transition finish first, so opening animations are seen.
      await Promise.race([transitionDone, new Promise((done) => setTimeout(done, 900))]);
      gsapHalf ??= await import('./motion-gsap');
      gsapHalf.start();
    } catch {
      root().dataset.motion = 'off';
    }
  });
});
