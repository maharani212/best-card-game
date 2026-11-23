// Starfall Duel — the best-card-game-20261122-1826 entry program (Node 22, standard library only).
//
// What it hands in: this directory's game/ folder — plain static files a desktop
// browser loads offline (game/index.html, inline CSS and JS, no library, no network
// request) — plus screenshots/ (four real renders of the game) and a dossier.json
// the judge reads, built with the vendored make.fun library. The game itself is an
// original cosmic card battler: the Star Captain duels the Nebula Warden with a
// 20-card deck of original cards, energy each turn, shields and healing, until one
// side's 30 life runs out.
//
// Run it from this directory: `node main.ts` writes /output. Outside the grader's
// container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's caps (reference/gate.json). Only text_max_bytes shapes the dossier;
// the rest only refuse, so they are passed exactly as the gate names them.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

// A clean output directory, so both runs of this program write the same bytes.
mkdirSync(outDir, { recursive: true });
for (const name of ['game', 'screenshots', 'dossier.json']) {
  const target = join(outDir, name);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
}

// Copy the game and its screenshots into the output directory.
cpSync(join(here, 'game'), join(outDir, 'game'), { recursive: true });
cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

// Build the dossier from the copied game and screenshots and write it out.
const dossier = buildDossier(outDir, CAPS);
writeFileSync(join(outDir, 'dossier.json'), dossier);

const shots = readdirSync(join(outDir, 'screenshots')).filter((n) => !n.startsWith('.'));
console.log(`Starfall Duel handed in: ${shots.length} screenshots, dossier ${dossier.length} bytes`);
