# Content guide

How to add and change things on the site. You never need to touch layout code: everything here is a text file in `src/content/` or `src/data/`, or an image you drop into a folder.

**The loop is always the same:** add or edit a file → [preview it](#preview-on-your-computer) → [publish it](#publish).

- [Replace these](#replace-these)
- [Preview on your computer](#preview-on-your-computer)
- [Publish](#publish)
- [Add a project](#add-a-project)
- [Add a post or devlog](#add-a-post-or-devlog)
- [Add a gallery piece](#add-a-gallery-piece)
- [Add a publication](#add-a-publication)
- [Replace the CV](#replace-the-cv)
- [Photos: portrait and the About strip](#photos-portrait-and-the-about-strip)
- [Your details: links, contact form, About page](#your-details-links-contact-form-about-page)
- [Tags and platforms](#tags-and-platforms)
- [Images](#images)
- [When the build fails](#when-the-build-fails)

---

## Replace these

The site went live with stand-ins wherever real material was missing. This is the full list. Tick each off as you replace it.

To see what is still outstanding at any time, with exact file names and line numbers:

```bash
npm run todo
```

### Your details (`src/data/site.ts`)

- [ ] **GitHub link.** Set to `https://github.com/mohity24k`, taken from the repository name. Confirm or correct it.
- [ ] **ORCID.** Add your ORCID URL. Until then the site shows "ORCID · Coming soon".
- [ ] **LinkedIn.** Add the URL, or leave it as `null` to keep LinkedIn off the site.
- [ ] **Contact form key.** Paste your Web3Forms key into `web3formsKey` (free at https://web3forms.com, sign up with your email). Until then the form opens the visitor's email app with the message filled in, instead of sending it.

### Files to drop in

- [ ] **CV.** `public/cv/Mohit_Gedam_CV.pdf` is a one-page placeholder. See [Replace the CV](#replace-the-cv).
- [ ] **Portrait.** Save your photo as `src/assets/portrait.jpg`.
- [ ] **About photo strip.** Five slots in `src/assets/life/`: `lab.jpg`, `chess.jpg`, `sparsh.jpg`, `beach-cleanup.jpg`, `travel.jpg`. Rewrite each caption in `src/data/about.ts`.
- [ ] **Gallery.** `src/content/gallery/stand-in-ridges`, `stand-in-skyline` and `stand-in-shore` (a `.yaml` and an `.svg` each) are stand-ins drawn by a script. Replace them with real pieces. See [Add a gallery piece](#add-a-gallery-piece).

### Projects (`src/content/projects/`)

Each file has a `placeholder: [...]` line listing what is still a stand-in. Fix a field, then remove its name from that list.

- [ ] `fake-news-detection.md`: completion date, cover image, GitHub link, fuller write-up.
- [ ] `green-chemistry-calculator.md`: completion date, cover image, Streamlit link, GitHub link, fuller write-up.
- [ ] `hindi-tts-xtts.md`: completion date, cover image, GitHub link, fuller write-up.
- [ ] `visual-novel.md`: start date, key art for the cover, a description in your words. Give it its title when it has one.

### Writing

- [ ] **Publication** `src/content/publications/ccus-review.md`: the exact publication date and the DOI.
- [ ] **Sample devlog** `src/content/posts/devlog-0-starting-the-visual-novel.md`: rewrite it in your own words, or delete it and write your own.
- [ ] **Bio** in `src/data/about.ts`: three paragraphs that only restate your CV.
- [ ] **Studio dialogue** in `src/data/studio.ts`: four lines that only restate your CV.

### What a placeholder does on the site

| In the `placeholder` list | What visitors see |
|---|---|
| `date` | The date is used for sorting but is not printed |
| `cover` | Generated artwork in that world's style |
| `liveUrl`, `codeUrl`, `paperUrl`, `doi` | A dashed "coming soon" badge instead of a link |
| `body` | Nothing different. It is a reminder for you |
| *(gallery)* anything | The piece is labelled "Stand-in" instead of "AI-generated" |

A link field that is simply left out, and not listed under `placeholder`, shows nothing at all. Use that when a project has no live demo and never will.

---

## Preview on your computer

You need [Node.js](https://nodejs.org) 22.23 or newer. The first time only:

```bash
npm install
```

Then, whenever you want to look at the site:

```bash
npm run dev
```

Open http://localhost:4321. The page reloads by itself each time you save a file. Press `Ctrl+C` in the terminal to stop.

Before publishing, it is worth building once, because this is where a mistake in a content file shows up:

```bash
npm run build
```

If it ends with `Complete!`, you are good. If not, see [When the build fails](#when-the-build-fails).

---

## Publish

Publishing is pushing to the `main` branch. GitHub then builds the site and puts it live, usually within two minutes.

```bash
git add -A
```

```bash
git commit -m "Add devlog 1"
```

```bash
git push
```

You can watch the deploy on the repository's **Actions** tab. A green tick means it is live at https://mohity24k.github.io. A red cross means the build failed and the old version of the site stays up; click the run to read the error, which is the same one `npm run build` shows.

You can also add or edit files directly on github.com (the pencil icon on any file, or **Add file**). Committing there publishes in the same way.

---

## Add a project

Create `src/content/projects/<short-name>.md`. The file name becomes the address: `my-project.md` in the Lab is `/lab/my-project/`.

```md
---
title: Name of the project
summary: One sentence that says what it is and why it matters.
world: lab            # lab (AI, chemistry, pharma, research) or studio (games, art, XR)
tags: [ai, research]  # see "Tags and platforms" below
status: completed     # completed, in-progress or exploring
date: 2026-11-15      # when you finished it (or the latest milestone)
platform: github      # where it lives; see "Tags and platforms"

# Everything below is optional. Delete the lines you do not need.
liveUrl: https://example.streamlit.app
codeUrl: https://github.com/mohity24k/example
paperUrl: https://example.org/paper.pdf
metrics:              # headline numbers; cards show the first two
  - value: "91.7%"
    label: accuracy / F1
  - value: "20%"
    label: fewer errors than text-only
cover: ./my-project.png          # an image saved next to this file
coverAlt: The dashboard showing a scored reaction
art: network          # generated cover if there is no image: molecule, network, waveform (Lab) or scene (Studio)
gallery: [piece-one, piece-two]  # gallery pieces to show on the page, by file name
featured: true        # show it in "Selected work" on the home page
featuredOrder: 1      # lower numbers come first
---

## Problem

What was wrong or missing.

## What I built

What you made and how.

## Results

What came of it, with numbers where you have them.

## Stack

The tools you used.
```

Notes:

- **Where it appears.** On the home page (under "Selected work" if `featured: true`, otherwise under "Latest"), on its world's index, and on the page of every tag it has.
- **`status: in-progress`** puts the project in the "Currently building" strip on the home page, with a link to its newest devlog.
- **Devlogs about a project** appear at the bottom of its page automatically. See `relatedProject` below.

---

## Add a post or devlog

Create `src/content/posts/<short-name>.md`. `my-post.md` becomes `/journal/my-post/`.

```md
---
title: "Devlog #1: consistent characters in ComfyUI"
summary: One sentence that would make someone want to read it.
date: 2026-12-15
tags: [devlog, gamedev, generative-art]

# Optional. Delete the lines you do not need.
relatedProject: visual-novel   # file name of the project this is about, without .md
cover: ./devlog-1.png
coverAlt: Four frames of the same character in different poses
updated: 2027-01-03            # shows "edited 3 Jan 2027" under the title
draft: true                    # visible in `npm run dev`, left out of the published site
---

The first paragraph gets the large first letter, so start it with a plain word.

## A heading

Write in Markdown: **bold**, *italic*, [links](https://example.org), lists, `code`.

![What the image shows](./a-picture-next-to-this-file.png)
```

Notes:

- **A devlog is a post tagged `devlog`.** Its card says "Devlog" instead of "Post".
- **`relatedProject`** links the post and the project in both directions, and makes it the "Latest devlog" on the home page strip if it is the newest.
- **Quote the title** if it contains a colon, as in the example.
- The post is added to the RSS feed at `/rss.xml` automatically.

---

## Add a gallery piece

Each piece is two files in `src/content/gallery/`: the image, and a small `.yaml` file describing it.

`src/content/gallery/heroine-sheet.yaml`:

```yaml
image: ./heroine-sheet.png
alt: A character sheet showing the heroine from the front, side and back.
caption: Character sheet for the heroine.
model: SDXL + IP-Adapter
workflow: ComfyUI, two-pass upscale
purpose: Reference for chapter 1
date: 2026-12-01

# Optional
relatedPost: devlog-1-consistent-characters   # file name of the devlog that explains it, without .md
```

For a **short video clip** (muted loop, under about 10 MB), put the clip in `public/gallery/` and a still frame next to the `.yaml`:

```yaml
video: /gallery/rain-loop.mp4
poster: ./rain-loop-poster.jpg
alt: Rain running down a window at night, on a loop.
caption: Rain on the window.
model: Stable Video Diffusion
workflow: ComfyUI, image-to-video
purpose: Background for the opening scene
date: 2026-12-10
```

Notes:

- Every field in the first example except `relatedPost` is required. The caption, model, workflow and purpose are what make the gallery honest about how each piece was made.
- A piece is labelled **"AI-generated"** automatically. (The three stand-ins say "Stand-in" only because they carry a `placeholder` line.)
- Longer videos belong on YouTube or Vimeo; link to them from a devlog.
- To show pieces on a project's page, list their file names in that project's `gallery:` field.

---

## Add a publication

Create `src/content/publications/<short-name>.md`.

```md
---
title: "The full title of the paper"
summary: One sentence on what the paper covers.
authors: ["Gedam, M.", "Second, A."]
year: 2026
venue: Name of the journal or conference
date: 2026-06-01
tags: [research, chemistry]

# Optional. Delete the lines you do not need.
volume: 71
issue: 2
pages: 45–58
doi: 10.1234/abcd.5678        # the bare DOI, not the https://doi.org/ link
url: https://example.org/paper  # use instead of doi when there is no DOI
---

Paste the abstract here if you want it on the page. This part is optional.
```

It appears in the Lab's reference list, in the home feed, and gets its own page with a BibTeX entry built from these fields.

---

## Replace the CV

1. Export your CV as a PDF **without your phone number**.
2. Name it exactly `Mohit_Gedam_CV.pdf`.
3. Put it in `public/cv/`, replacing the file that is there.
4. [Publish](#publish).

Every "CV" button on the site points at that one file, so nothing else changes. Because the address never changes, the link on your printed CV keeps working too.

---

## Photos: portrait and the About strip

**Portrait.** Save it as `src/assets/portrait.jpg` (`.png`, `.webp` and `.avif` also work). It replaces the stand-in on the home page and the About page. A photo taller than it is wide, around 4:5, crops best.

**About strip.** Save photos in `src/assets/life/` using the file names listed in `src/data/about.ts`:

```ts
export const lifePhotos: LifePhoto[] = [
  { file: 'lab', caption: 'In the lab', standIn: { icon: 'flask', world: 'lab' } },
  // ...
];
```

So `file: 'lab'` is looked for as `src/assets/life/lab.jpg`. When the file exists the photo is shown; until then the stand-in tile is. Rewrite `caption` as one line about the actual photo. Add `alt: '...'` if the caption does not describe what is in the picture. You can add, remove and reorder the entries; 4 to 8 reads best.

---

## Your details: links, contact form, About page

| To change | Edit |
|---|---|
| Name, the home page sentence, social links, email, contact form key | `src/data/site.ts` |
| Bio, skills, education, certifications, activities, photo captions, "Currently exploring" | `src/data/about.ts` |
| The dialogue that opens the Studio | `src/data/studio.ts` |

Each file has comments explaining its fields.

**The home page sentence** is `intro` in `site.ts`. A part with a `world` is painted in that world's style and links to it:

```ts
intro: [
  { text: 'I build ' },
  { text: 'ML for chemistry & drug problems', world: 'lab' },
  { text: ' and ' },
  // ...
],
```

**Share cards.** When a link to the site is posted somewhere, the preview picture is one of four images in `public/og/` (one per world). They contain your name and each world's description. If you change those words and want the cards to match, ask for them to be regenerated; they are ordinary 1200 × 630 PNG files and can also be replaced by hand. A project or post with its own `cover` uses that instead.

---

## Tags and platforms

These are fixed lists, so a typo is caught instead of quietly creating a new tag.

**Tags:** `ai`, `pharma`, `chemistry`, `research`, `gamedev`, `generative-art`, `xr`, `devlog`

**Platforms:** `streamlit`, `vercel`, `netlify`, `github`, `huggingface`, `itch`, `journal`, `doi`, `unreleased`

**Status:** `completed`, `in-progress`, `exploring`

To add a new tag or platform, add one line to the matching list in `src/data/taxonomy.ts`:

```ts
export const TAGS = {
  ai: 'AI',
  // ...
  robotics: 'Robotics',   // id used in content files: 'Label shown on the site'
} as const;
```

A tag gets a filter chip and its own page (`/tags/robotics/`) as soon as one entry uses it, and loses them when none do. Tag pages are good links for a CV: `https://mohity24k.github.io/tags/pharma/` shows only your pharma work.

---

## Images

- **Put images next to the content file** that uses them (or in `src/assets/`), not in `public/`. Images there are resized and converted to modern formats automatically.
- **Any reasonable size is fine.** Around 1600 px wide is plenty. Covers are cropped to 16:10 on cards.
- **Always write `coverAlt` / `alt`:** one sentence saying what is in the picture, for people who cannot see it.
- **`public/`** is only for files that must keep their exact name and address: the CV, video clips, the share cards.

---

## When the build fails

The build stops on purpose when a content file has a mistake, so a broken entry never reaches the live site. The message names the file, the field, and what to do. For example:

```text
projects → my-project data does not match collection schema.

  tags.1: Unknown tag "biology". Use one of: ai, pharma, chemistry, research,
  gamedev, generative-art, xr, devlog. To create a new tag, add it to TAGS in
  src/data/taxonomy.ts.
```

Read it as: in `src/content/projects/my-project.md`, the second tag is not on the list.

| Message mentions | Usual cause |
|---|---|
| `"date" is required` | The `date:` line is missing, or not written as `YYYY-MM-DD` |
| `Unknown tag` | A typo, or a new tag not yet added to `taxonomy.ts` |
| `must be a full URL` | The link is missing `https://`. If the link does not exist yet, delete the line and add the field to `placeholder` |
| `"world" must be lab … or studio` | `world:` is misspelt |
| `needs exactly one of "image" or "video"` | A gallery `.yaml` has both, or neither |
| `needs a "poster" image` | A video piece has no still frame |
| `Could not find requested image` | The path after `cover:` or `image:` does not match a file. Paths start with `./` and are relative to the content file |
| Anything about `YAML` or `---` | The top block of the file is malformed: check each line is `name: value`, lists use `[a, b]`, and titles containing a colon are in quotes |

Other checks you can run:

| Command | What it tells you |
|---|---|
| `npm run todo` | Everything that is still a placeholder |
| `npm run check` | Type errors in the site's code (only relevant if code was changed) |
| `npm run check:contrast` | Whether every world's colours still meet WCAG AA (only relevant if `tokens.css` was changed) |
