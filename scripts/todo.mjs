#!/usr/bin/env node
// Lists everything on the site that is still a placeholder.
//   npm run todo
// Two sources:
//   1. `placeholder: [...]` in content frontmatter (src/content/**)
//   2. `TODO(mohit)` comments anywhere in src/ and public/

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const TEXT = /\.(md|mdx|ya?ml|ts|mjs|js|astro|css|json|txt|svg)$/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (TEXT.test(name)) yield path;
  }
}

const placeholders = [];
const todos = [];

for (const dir of ['src', 'public']) {
  for (const file of walk(join(root, dir))) {
    const rel = relative(root, file);
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const fields = rel.startsWith('src/content/') && line.match(/^placeholder:\s*\[(.*)\]/);
      if (fields && fields[1].trim()) placeholders.push(`  ${rel}\n      ${fields[1].trim()}`);
      const todo = line.match(/TODO\(mohit\):?\s*(.*?)\s*(-->|\*\/)?\s*$/);
      if (todo) todos.push(`  ${rel}:${i + 1}\n      ${todo[1]}`);
    });
  }
}

console.log(`Content entries with placeholder fields (${placeholders.length})\n`);
console.log(placeholders.join('\n') || '  none');
console.log(`\nTODO(mohit) notes (${todos.length})\n`);
console.log(todos.join('\n') || '  none');
