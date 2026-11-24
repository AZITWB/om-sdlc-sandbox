#!/usr/bin/env node
// Grades an SDLC routing quiz answers file against sdlc-routing-quiz.key.md.
// Usage: node docs/prompt-toolbox/sdlc-routing-quiz.grade.mjs <answers.txt>
// Exit code: 0 all pass, 1 any fail, 2 usage or parse error.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const answersPath = process.argv[2];
if (!answersPath) {
  console.error('Usage: node sdlc-routing-quiz.grade.mjs <answers.txt>');
  process.exit(2);
}

const ID = /^S\d{2}$/;

function parseLines(text) {
  const rows = new Map();
  for (const raw of text.split(/\r?\n/)) {
    // Split on a single "|" only; "||" separates alternatives inside a cell.
    const cells = raw.split(/(?<!\|)\|(?!\|)/).map((c) => c.trim());
    const id = cells[0]?.replace(/\.$/, '').toUpperCase();
    if (cells.length < 3 || !ID.test(id)) continue;
    rows.set(id, { category: cells[1], action: cells[2], note: cells.slice(3).join(' | ') });
  }
  return rows;
}

function readOrExit(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    console.error(`Cannot read ${path}: ${err.message}`);
    process.exit(2);
  }
}

const alternatives = (s) => s.split('||').map((a) => a.trim()).filter(Boolean);
const tokens = (s) => s.replace(/`/g, '').toLowerCase().split(/\s+/).filter(Boolean);

function categoryOk(expected, actual) {
  if (expected.trim() === '*') return true;
  const a = actual.replace(/`/g, '').trim().toLowerCase();
  return alternatives(expected).some((e) => e.toLowerCase() === a);
}

function actionOk(expected, actual) {
  const got = tokens(actual);
  if (got.length === 0) return false;
  return alternatives(expected).some((alt) => {
    const [command, ...flags] = tokens(alt);
    if (got[0] !== command) return false;
    return flags.every((f) => (f.startsWith('!') ? !got.includes(f.slice(1)) : got.includes(f)));
  });
}

const key = parseLines(readOrExit(join(here, 'sdlc-routing-quiz.key.md')));
const answers = parseLines(readOrExit(answersPath));
if (key.size === 0) {
  console.error('Key has no scenario lines.');
  process.exit(2);
}

let passed = 0;
const failed = [];
for (const [id, exp] of key) {
  const ans = answers.get(id);
  const catOk = ans ? categoryOk(exp.category, ans.category) : false;
  const actOk = ans ? actionOk(exp.action, ans.action) : false;
  if (catOk && actOk) {
    passed += 1;
    console.log(`PASS ${id}`);
    continue;
  }
  failed.push(id);
  console.log(`FAIL ${id}`);
  if (!ans) {
    console.log('     missing answer');
  } else {
    if (!catOk) console.log(`     category: expected "${exp.category}", got "${ans.category}"`);
    if (!actOk) console.log(`     action:   expected "${exp.action}", got "${ans.action}"`);
    if (ans.note) console.log(`     reason:   ${ans.note}`);
  }
  console.log(`     source:   ${exp.note}`);
}

const extra = [...answers.keys()].filter((id) => !key.has(id));
if (extra.length) console.log(`\nIgnored answers with no key line: ${extra.join(' ')}`);

console.log(`\n${passed}/${key.size} passed${failed.length ? `; failed: ${failed.join(' ')}` : ''}`);
process.exit(failed.length ? 1 : 0);
