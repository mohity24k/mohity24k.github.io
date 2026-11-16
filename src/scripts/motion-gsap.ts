/**
 * Motion: the GSAP half. Loaded when the browser is idle, never under
 * "reduce motion".
 *
 * Each world moves in its own way:
 *   Lab      precise and quick. Diagrams draw themselves, numbers count up,
 *            mono labels type in.
 *   Studio   cinematic and slow. Scenes have depth (parallax), gallery
 *            pieces tilt towards the pointer.
 *   Journal  soft and unhurried. Things fade up as you reach them; the drop
 *            cap settles into place.
 *
 * Rules every effect follows:
 *   - Content is visible by default. Only things that are below the fold
 *     when the page opens are given a "before" state, so nothing a visitor
 *     is already looking at ever blinks out.
 *   - Reveals change opacity and transform only, never visibility, so
 *     keyboard focus can always reach them.
 *   - On touch screens and small screens the effects are lighter: shorter
 *     moves, no parallax, no tilt.
 */
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

type World = 'neutral' | 'lab' | 'studio' | 'journal';

const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const small = matchMedia('(max-width: 40rem)').matches;
/** Lighter effects on touch and small screens. */
const lite = !finePointer || small;

const all = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(selector),
];
const worldOf = (el: Element) => (el.closest<HTMLElement>('[data-world]')?.dataset.world ?? 'neutral') as World;
/** True when the element starts below what the visitor can see. */
const belowFold = (el: Element) => el.getBoundingClientRect().top > innerHeight * 0.95;
const onEnter = (trigger: Element, start = 'top 92%') => ({ trigger, start, once: true });

let context: gsap.Context | undefined;

export function start() {
  context?.revert();
  context = gsap.context(() => {
    reveals();
    lab();
    studio();
    journal();
  });
  // Opening states are set; let the waiting pieces show (see motion.css).
  document.documentElement.dataset.motion = 'on';
}

export function stop() {
  context?.revert();
  context = undefined;
}

/* ── How a thing arrives, by world ─────────────────────────────────────── */

const ARRIVE: Record<World, gsap.TweenVars> = {
  neutral: { opacity: 0, y: 12, duration: 0.4, ease: 'power2.out' },
  lab: { opacity: 0, y: 14, duration: 0.32, ease: 'power3.out' },
  studio: { opacity: 0, scale: 1.035, duration: 0.85, ease: 'expo.out' },
  journal: { opacity: 0, y: 8, duration: 0.7, ease: 'sine.inOut' },
};

/** Run something once, when an element first scrolls into view. */
function whenSeen(trigger: Element, run: () => void, start = 'top 92%') {
  ScrollTrigger.create({ trigger, start, once: true, onEnter: run });
}

/**
 * Give a below-the-fold element its "before" state now (cheap), and play its
 * arrival when it is reached. Anything extra (drawing a cover, counting a
 * number) is passed as `then` and is only built at that moment, so a page
 * with many cards does no animation work up front.
 */
function arrive(el: Element, world: World, delay = 0, then?: () => void) {
  const { duration, ease, ...before } = ARRIVE[world];
  if (lite && typeof before.y === 'number') before.y = before.y / 2;
  gsap.set(el, before);
  whenSeen(el, () => {
    gsap.to(el, { opacity: 1, y: 0, scale: 1, duration, ease, delay, clearProps: 'opacity,transform' });
    then?.();
  });
}

/* ── Cards, everywhere ─────────────────────────────────────────────────── */

function reveals() {
  for (const grid of all('.grid')) {
    const cells = all(':scope > li', grid).filter((cell) => !cell.hidden && belowFold(cell));
    cells.forEach((cell) => {
      const card = cell.querySelector('.card');
      if (!card) return;
      // Cards in the same row arrive a beat apart, left to right.
      const column = Math.round(cell.offsetLeft / Math.max(1, cell.offsetWidth));
      const delay = column * 0.07;
      arrive(cell, worldOf(card), delay, () => {
        const art = card.querySelector('.art');
        if (art) drawArt(art, delay + 0.1);
        for (const value of all('.card__metrics dd', card)) countUp(value, { delay });
      });
    });
  }
}

/** Generated cover art builds itself: drawn in the Lab, rising in the Studio and Journal. */
function drawArt(art: Element, delay = 0) {
  const tl = gsap.timeline({ delay });
  const strokes = all<SVGElement>('.ink > line, .edges line', art);
  const atoms = all<SVGElement>('.atom', art);
  const nodes = all<SVGElement>('.node', art);
  const bars = all<SVGElement>('.bars line', art);
  const ridges = all<SVGElement>('.ridge', art);
  const disc = all<SVGElement>('.disc, .disc-glow', art);
  const letter = all<SVGElement>('.mono-letter, .cite-year', art);
  const rules = all<SVGElement>('.rule', art);

  if (strokes.length) tl.from(strokes, { drawSVG: 0, duration: 0.5, ease: 'power2.out', stagger: { amount: 0.45 } }, 0);
  if (atoms.length) tl.from(atoms, { opacity: 0, duration: 0.2, stagger: 0.04 }, 0.35);
  if (nodes.length) tl.from(nodes, { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(2)', stagger: { amount: 0.4 } }, 0.15);
  if (bars.length) tl.from(bars, { scaleY: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'power3.out', stagger: { amount: 0.5 } }, 0);
  if (disc.length) tl.from(disc, { y: 26, duration: 1.2, ease: 'expo.out' }, 0);
  if (ridges.length) tl.from(ridges, { y: (i) => 10 + i * 9, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 0);
  if (letter.length) tl.from(letter, { y: 26, opacity: 0, duration: 0.8, ease: 'sine.out' }, 0);
  if (rules.length) tl.from(rules, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.7, ease: 'sine.inOut', stagger: 0.08 }, 0.1);
  return tl;
}

/* ── Lab ───────────────────────────────────────────────────────────────── */

/**
 * Count a number up to its value, keeping any prefix, suffix, decimals and
 * thousands separators. With `onScroll` it waits until the number is in view;
 * otherwise it starts now.
 */
function countUp(el: HTMLElement, { onScroll = false, delay = 0 } = {}) {
  const original = el.textContent ?? '';
  const match = original.trim().match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
  if (!match) return;
  const [, before = '', digits = '', after = ''] = match;
  const target = parseFloat(digits.replace(/,/g, ''));
  const decimals = (digits.split('.')[1] ?? '').length;
  const format = (value: number) =>
    before +
    value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: digits.includes(','),
    }) +
    after;

  const state = { value: 0 };
  el.textContent = format(0);
  gsap.to(state, {
    value: target,
    duration: 1.1,
    ease: 'power2.out',
    delay,
    scrollTrigger: onScroll ? onEnter(el, 'top 94%') : undefined,
    onUpdate: () => (el.textContent = format(state.value)),
    onComplete: () => (el.textContent = original),
  });
  // If the page's animations are torn down mid-count, put the real number back.
  context?.add(() => () => (el.textContent = original));
}

/** Type a label out, character by character, without it changing size. */
function typeIn(el: HTMLElement, delay = 0) {
  if (el.children.length > 0 && !el.querySelector('sub')) return;
  const html = el.innerHTML;
  const text = el.textContent ?? '';
  const typed = document.createElement('span');
  const rest = document.createElement('span');
  rest.style.visibility = 'hidden';
  rest.textContent = text;
  el.replaceChildren(typed, rest);

  const state = { count: 0 };
  gsap.to(state, {
    count: text.length,
    duration: Math.min(1.2, text.length / 42),
    ease: 'none',
    delay,
    scrollTrigger: onEnter(el, 'top 96%'),
    onUpdate: () => {
      const n = Math.round(state.count);
      typed.textContent = text.slice(0, n);
      rest.textContent = text.slice(n);
    },
    // Restore the original markup (subscripts and all) once typed.
    onComplete: () => (el.innerHTML = html),
  });
  context?.add(() => () => (el.innerHTML = html));
}

function lab() {
  // The figure at the top of the Lab draws itself, then its caption types in.
  for (const figure of all<SVGElement>('[data-draw]')) {
    const lines = all<SVGElement>('line', figure);
    const labels = all<SVGElement>('text', figure);
    gsap
      .timeline({ scrollTrigger: onEnter(figure, 'top 96%') })
      .from(lines, { drawSVG: 0, duration: 0.6, ease: 'power2.inOut', stagger: { amount: 0.7 } })
      .from(labels, { opacity: 0, duration: 0.25, stagger: 0.06 }, '-=0.25');
  }

  // Headline numbers on a project page count up when they come into view.
  for (const value of all('[data-metric]')) {
    countUp(value, { onScroll: true });
  }

  // Mono labels type in. Lab only: it is the Lab's voice.
  all('[data-typein]')
    .filter((label) => worldOf(label) === 'lab')
    .forEach((label, i) => typeIn(label, label.closest('figure') ? 0.9 : (i % 4) * 0.08));

  // Reference list entries and certificates arrive like the cards do.
  for (const row of all('.refs > li, .certs > li').filter(belowFold)) arrive(row, 'lab');
}

/* ── Studio ────────────────────────────────────────────────────────────── */

function studio() {
  // Depth: layers of a scene shift against each other with the pointer.
  // Pointer parallax needs a mouse; scroll parallax is skipped on small screens.
  for (const sceneArt of all('.art--scene')) {
    const frame = sceneArt.closest<HTMLElement>('.stage__frame, .card, .strip');
    const layers = all<SVGElement>('[data-depth]', sceneArt);
    if (!frame || layers.length === 0) continue;
    const hero = frame.classList.contains('stage__frame');
    const reach = hero ? 16 : 7;

    if (finePointer) {
      const movers = layers.map((layer) => ({
        depth: Number(layer.dataset.depth),
        x: gsap.quickTo(layer, 'x', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(layer, 'y', { duration: 0.9, ease: 'power3.out' }),
      }));
      frame.addEventListener('pointermove', (event) => {
        const box = frame.getBoundingClientRect();
        const dx = (event.clientX - box.left) / box.width - 0.5;
        const dy = (event.clientY - box.top) / box.height - 0.5;
        for (const { depth, x, y } of movers) {
          x(-dx * reach * depth * 2);
          y(-dy * reach * depth);
        }
      });
      frame.addEventListener('pointerleave', () => movers.forEach(({ x, y }) => (x(0), y(0))));
    }

    if (hero && !lite) {
      // As the hero scrolls away, near layers leave faster than far ones.
      gsap.to(sceneArt.querySelector('svg'), {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top top', end: 'bottom top', scrub: true },
      });
    }
  }

  // Gallery pieces tilt towards the pointer (the glow is in motion.css).
  if (finePointer) {
    for (const piece of all('.gallery .piece__open')) {
      gsap.set(piece, { transformPerspective: 700 });
      const rx = gsap.quickTo(piece, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const ry = gsap.quickTo(piece, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      piece.addEventListener('pointermove', (event) => {
        const box = piece.getBoundingClientRect();
        ry(((event.clientX - box.left) / box.width - 0.5) * 9);
        rx(-((event.clientY - box.top) / box.height - 0.5) * 9);
      });
      piece.addEventListener('pointerleave', () => (rx(0), ry(0)));
    }
  }

  for (const item of all('.gallery > li').filter(belowFold)) arrive(item, 'studio');
}

/* ── Journal ───────────────────────────────────────────────────────────── */

function journal() {
  // Soft fade-ins for what is further down the page.
  const blocks = all('.lead, .row, .post__nav, .post__section');
  if (document.documentElement.dataset.world === 'journal') blocks.push(...all('.prose > *'));
  for (const block of blocks.filter(belowFold)) arrive(block, 'journal');

  // The drop cap settles into place: it rises from its baseline and firms up.
  for (const cap of all('.dropcap')) {
    gsap.from(cap, { opacity: 0, yPercent: 22, scale: 0.86, transformOrigin: '0% 100%', duration: 1, ease: 'power2.out', delay: 0.1 });
  }
}
