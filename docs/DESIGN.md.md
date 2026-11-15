# Mohit Gedam — Personal Portfolio & Hub: Design

Date: 2026-11-15 · Status: draft for approval

## 1. Intent

Mohit is a final-year B.Tech student in Pharmaceutical Chemistry & Technology (ICT Mumbai, minor in AI/ML, graduating Aug 2027) who works across AI/ML, cheminformatics, pharma, research, and game development (a visual novel in progress), with VR/AR planned.

The site is **his own all-in-one home base**: one place that tells his story, shows his images, and lists every piece of work he has made — most of which lives elsewhere (Streamlit, Netlify, Vercel, GitHub, itch.io, journals). It doubles as a blog, updated **about once a month**.

He will put the link on his CV, so recruiters and admissions readers will land on it, but he doesn't want to design for one audience. The design solves this with **filterable, linkable views**: one site, and any visitor (or a CV link) can jump straight to the slice that matters.

**Success looks like:** someone from his CV sees real work within seconds; his range across AI, chemistry and games reads as a strength rather than as scatter; adding a new project, post or image each month takes about 5 minutes and never requires touching layout code.

## 2. Goals, non-goals, anti-goals

**Goals**
- Present Mohit, his projects, publication, interests, photos and AI art.
- Act as a hub of outbound links to work hosted on other platforms, each card clearly showing where it lives.
- Host a monthly blog/devlog (writing lives *on* the site).
- Three visual "worlds" with distinct personalities, joined by a shared skeleton.
- Fun, tasteful animation (GSAP).
- Downloadable CV and a working contact form.
- Free hosting on GitHub Pages.

**Non-goals**
- No CMS, database, login, or server-side code.
- No comments system (not requested).
- No analytics requirement (builder may add privacy-friendly analytics only if trivial; off by default).
- VR/AR content does not exist yet; no VR/AR section is built beyond what the tag system provides automatically.

**Anti-goals (would be a failure even if it "works")**
- Feels like three websites stitched together instead of one person with range.
- Animations hide content, block reading, cause jank on mobile, or ignore "reduce motion".
- Adding an entry requires editing components/layout code.
- Empty sections or filters with zero items visible to visitors.
- Phone number appears anywhere on the public site.
- Generic template look ("AI-generated portfolio" feel).

## 3. Constraints

- **Hosting:** GitHub Pages (static only). Deploy via GitHub Actions using Astro's official Pages workflow.
- **Repo:** recommended name `<github-username>.github.io` so the site lives at the root URL (no `base` path headaches). If a project repo is used instead, Astro `site` and `base` must be set accordingly.
- **Size:** GitHub Pages soft limit ~1 GB per site; keep images optimized (Astro generates WebP/AVIF), keep only short clips (< ~10 MB, muted loop) in the repo; long videos are embedded from YouTube/Vimeo.
- **Privacy:** no phone number on the site. The downloadable CV is a separate web version Mohit supplies (no phone). Email is fine.
- **Content sources today** (from CV):
  - Projects: Multimodal Fake News Detection (BERT + ResNet-50, 91.7% accuracy/F1, 20% error reduction vs text-only); Automated Green Chemistry & Reaction Metrics Calculator (PDF extraction → SMILES → PMI/Atom Economy/E-Factor/EcoScale/GHS, Streamlit dashboard); Hindi TTS XTTS-v2 fine-tune (~10 h, 4,586 clips, eval loss −12.7%).
  - Publication: Gedam, M. (2023). *The Role of CCUS in a Low Carbon Future: A Critical Review.* The Bombay Technologist, 70(1). (DOI link)
  - Certification: Data Science for Engineers — NPTEL (10/2024).
  - Activities: Sparsh NGO volunteer instructor, ACS student member, Bandra beach clean-up volunteer, competitive chess.
  - Skills: Python, Pandas, NumPy, SQL, Docker, scikit-learn, PyTorch, TensorFlow, Hugging Face, RDKit, HPLC/GC/NMR/UV-Vis, Streamlit.
  - In progress: a visual novel; assets generated with ComfyUI + open-source image/video models.
  - Links: GitHub, ORCID, email (mohity24k@gmail.com); LinkedIn if he has one.
- All three CV projects are **completed** per Mohit (CV date ranges are not authoritative for status).

## 4. Approaches considered

| Approach | Trade-offs | Decision |
|---|---|---|
| **Astro + GitHub Actions** | Built-in image optimization (matters for gallery/art), typed content collections that fail loudly on bad entries, easy per-section layouts, near-zero JS by default, View Transitions for world-to-world transitions. Needs Node locally + one Actions workflow. | **Chosen** |
| Jekyll (native GitHub Pages) | Zero setup, but no image optimization, silent errors in front matter, clunky multi-theme/filter logic in Liquid. | Rejected |
| Plain HTML + JSON | No build, but blog posts awkward and poorly indexed, no image pipeline, gets messy with monthly growth. | Rejected |

## 5. Decided design

### 5.1 Information architecture

Three **worlds** + neutral shared pages:

| World | Content | Style |
|---|---|---|
| **Lab** `/lab` | AI/ML, cheminformatics, pharma, research projects; publications; certifications | Lab Notebook |
| **Studio** `/studio` | Game dev (visual novel), AI art gallery, future VR/AR | Dark Studio |
| **Journal** `/journal` | Blog posts and devlogs | Editorial Journal |
| Neutral | Home `/`, About `/about` (incl. photos + contact), 404 | Neutral base |

**Feed items** are projects, posts and publications. Each belongs to exactly one world (which sets its style) and has any number of **interest tags**: `ai`, `pharma`, `chemistry`, `research`, `gamedev`, `xr`, `generative-art` (extendable). Tags filter across worlds.

**Linkable filters:** the homepage feed and each world's index support filtering by tag via URL (e.g. `/?tag=pharma` or `/tags/pharma/`) so Mohit can put a specific slice on a CV. Filter chips for tags with zero items are hidden.

*(Designer's call:)* **Gallery pieces are not feed items.** They appear only in the Studio Gallery (and inline in related devlogs/projects), so individual images don't flood the feed. Publications *are* feed items (world `lab`, tagged, with a generated typographic card if no cover image).

**Status** on projects: `completed` · `in-progress` · `exploring`.

### 5.2 Homepage (chosen: "neutral hub")

- Shared top bar: name (home link) · Lab · Studio · Journal · About · **CV ↓** button.
- Intro: portrait (small), "Hi, I'm Mohit." + one-line positioning (AI × chemistry & drug discovery, plus games built with generative AI), social links (GitHub, ORCID, LinkedIn, email).
- **Currently building** strip: driven by any item with `status: in-progress` (today: the visual novel) — title, one line, latest asset image, link to latest related devlog.
- Filter chips: All · AI · Pharma · Chemistry · Research · Game Dev · (others that have items).
- *(Designer's call:)* **Selected work** row: up to 3–4 items with `featured: true`, shown above the feed in a fixed order (`featuredOrder` field), so flagship projects never get pushed down by monthly posts. Today: the three CV projects.
- **Mixed feed**: newest-first cards from all worlds (sorted by each item's `date`; for projects, `date` = completion date Mohit sets, not the CV range); **each card is styled in its own world** (Lab card light/graph-paper/mono, Studio card dark/glow, Journal card serif/paper). Clicking enters that world's full styling.
- Footer: links, "Get in touch" → contact, © year.

Sketch:
```
[Name]                     Lab · Studio · Journal · About   [CV ↓]
Hi, I'm Mohit. I build ML for chemistry & drug problems,
and games with generative AI.      (GitHub) (ORCID) (LinkedIn) (✉)

CURRENTLY BUILDING ─ Visual novel · WIP · latest devlog →

All · AI · Pharma · Chemistry · Research · Game Dev
┌ LAB ──────────┐ ┌ STUDIO ───────┐ ┌ JOURNAL ──────┐
│ Green Chem    │ │ Visual novel  │ │ Consistent    │
│ Calculator    │ │ WIP           │ │ characters in │
│ Streamlit ↗   │ │ devlog #3     │ │ ComfyUI       │
└───────────────┘ └───────────────┘ └───────────────┘
```

### 5.3 Shared skeleton (what keeps it one site)

Same top bar, footer, grid, spacing scale, card shape/anatomy, and focus styles everywhere. Worlds change only: color tokens, typography pairing, background texture, motion personality. Implement as CSS custom-property themes applied per world (e.g. `data-world="lab|studio|journal|neutral"` on `<html>`/`<body>`).

### 5.4 The three worlds' styles

- **Lab Notebook:** light off-white with subtle graph-paper grid; deep green accent; clean sans + monospace for labels/metrics (`// comments`, stat values); thin borders; precise, calm. Reads "scientist who codes".
- **Dark Studio:** near-black with violet/cyan accents and soft glows; image-first; bold sans display type; cinematic. Solid-color headings (no gradient text).
- **Editorial Journal:** warm paper tones, serif body and display (italic headings), rust accent, rules/dividers like a magazine; generous reading measure (~65–75ch).
- **Neutral (home/about):** clean light base that lets the world-styled cards carry color.
- All themes must meet WCAG AA contrast and keep body text ≥ 16px. A light/dark toggle is not required (each world has a fixed personality).

### 5.5 Card anatomy (all worlds)

Thumbnail · title · one-line summary · up to 2 headline metrics (e.g. "91.7% acc") · tags · **platform badge** (Streamlit / Vercel / Netlify / GitHub / itch.io / Journal / DOI) · status pill if not completed. Primary click → on-site detail page; secondary "Live ↗" / "Code ↗" go external (open in new tab).

### 5.6 Project detail page

Format: **Problem → What I built → Results → Stack → Links**, plus optional gallery and related devlogs. Large prominent buttons for live demo / code / paper.

### 5.7 Studio Gallery

Masonry grid of AI-generated images and short looping videos; click opens a lightbox (keyboard + swipe navigable). **Every piece has a caption: model, workflow, purpose** (e.g. "SDXL + IP-Adapter · character sheet for VN ch.1"), optional link to the devlog that explains it. Clear "AI-generated" labelling.

### 5.8 About page

Portrait; bio (expanded from CV summary); skills grouped (Programming & Data, ML, NLP/CV, Cheminformatics, Analytical Chemistry, Tools); education; certification; activities; a "life" photo strip (4–8 personal photos with one-line captions — lab, chess, beach clean-up, Sparsh teaching, travel); "Currently exploring: VR/AR"; contact form; CV download.

### 5.9 Downloadable CV

`public/cv/Mohit_Gedam_CV.pdf` (stable filename; Mohit replaces the file to update). Linked from top bar on every page and from About. This is the **phone-free web version** Mohit supplies.

### 5.10 Contact form

Static site → third-party form backend: **Web3Forms** (default) or Formspree. Fields: name, email, topic (Opportunity / Collaboration / Just saying hi), message; honeypot spam field; success/error states inline without leaving the page. Access key kept in site config (Web3Forms keys are public-safe by design). Fallback `mailto:` link.

### 5.11 Motion (GSAP + Astro View Transitions)

Each world has a motion personality:
- **Lab:** SVG molecule/diagram line-drawing on scroll (DrawSVG); metric count-ups when in view; monospace labels typing in.
- **Studio:** a **visual-novel dialogue box** intro on `/studio` ("Mohit: Welcome to the studio…" typewriter + click-to-continue); layered parallax of character art/backgrounds; gallery cards tilt + glow on hover; scene-fade page transitions.
- **Journal:** soft fade-ins, reading-progress bar, animated drop cap.
- **Global:** world-to-world transitions (light → dark when entering Studio, etc.) via Astro View Transitions.

**Guardrails (mandatory):** content is never hidden behind animation (it renders without JS); `prefers-reduced-motion` gets a calm version (no parallax, no typewriter, instant reveals); lighter effects on mobile/touch; no layout shift; animations must not hurt Lighthouse performance materially (target ≥ 90 on mobile for home).

### 5.12 Content authoring workflow (the 5-minute monthly add)

Astro **content collections** with schema validation (Zod), so a missing date or unknown tag fails the build with a clear error:

- `src/content/projects/<slug>.md` — frontmatter: `title, summary, world (lab|studio), tags[], status, date, platform, liveUrl?, codeUrl?, paperUrl?, metrics[] (label/value), cover (image), featured?, featuredOrder?`; body = the write-up.
- `src/content/posts/<slug>.md` (or `.mdx`) — `title, summary, date, tags[], cover?, relatedProject?`; body = post. All posts live in Journal; devlogs are posts tagged `gamedev`/`devlog`.
- `src/content/gallery/*.yaml` (or one file per item) — `image|video, caption, model, workflow, purpose, date, relatedPost?`.
- `src/content/publications/` — citation fields, DOI link, `date, tags[], summary, cover?` (world is always `lab`).
- `src/data/site.ts` (or `.yaml`) — name, tagline, socials, CV path, form key.
- Images live next to content or in `src/assets/` so Astro optimizes them.

The repo includes a short **`CONTENT_GUIDE.md`** with copy-paste templates for "add a project", "add a post", "add a gallery piece", "replace the CV", and how to preview locally (`npm run dev`) and publish (`git push`).

### 5.13 SEO & sharing

Per-page titles/descriptions, Open Graph/Twitter cards (cover image per item), sitemap, RSS feed for Journal, canonical URLs, `robots.txt`.

## 6. Left to the builder

- Exact fonts, color values and spacing scale within each world's described personality.
- Whether filters use query params or static `/tags/<tag>/` pages (both acceptable; must be linkable and work without JS for at least the static form).
- Lightbox, masonry and form implementation details.
- Seed content: create the three CV projects, the publication, one sample devlog post and 2–3 placeholder gallery items using placeholder images, clearly marked for Mohit to replace.
- Placeholder assets for portrait/photos where real ones aren't supplied yet.

## 6a. Placeholder policy (decided by Mohit: ship with placeholders)

The first deploy goes live with placeholders wherever real material is missing; every section is visible from day one.
- *(Designer's call:)* Placeholders must look **intentional**, not broken: generated world-styled artwork (e.g. Lab graph-paper with a molecule glyph, Studio dark gradient with a silhouette, Journal paper texture with a monogram) instead of grey boxes or stock photos.
- *(Designer's call:)* **Never fake facts.** No invented metrics, links, testimonials or project claims. Missing URLs render as a disabled "Coming soon" badge, not a dead link. Real CV facts (listed in §3) are used verbatim.
- Every placeholder is tagged in source (e.g. `placeholder: true` in frontmatter or a `TODO(mohit)` comment) and listed in a **"Replace these" checklist** at the top of `CONTENT_GUIDE.md`.
- Missing CV PDF: ship a placeholder PDF at the stable path so the button works; contact form without an access key falls back to `mailto:`.

## 7. Open items for Mohit to supply

- GitHub username (for repo name/URL), LinkedIn URL (if any), ORCID ID, DOI link.
- Live URLs for the Streamlit app and GitHub repos of the three projects.
- Portrait, personal photos, ComfyUI art.
- The phone-free web CV PDF.
- Web3Forms access key (free signup with his email).
