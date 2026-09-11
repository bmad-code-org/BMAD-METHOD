/**
 * Export standalone copies of the authored diagrams for the repo READMEs.
 *
 * The diagrams in `src/diagrams` carry no colours of their own: they name
 * tokens (`var(--dg-ink)`) and classes (`.node`, `.edge`) that `custom.css`
 * resolves per theme once the docs site inlines them. That is what lets one
 * drawing serve light and dark, but it also means the file is unreadable on
 * its own — a README loads it as an `<img>`, where no page CSS can reach it.
 *
 * So the README gets an export, not the source: the same geometry with every
 * token substituted for a literal colour and a ground painted behind it. The
 * dark ramp rather than the light one because a README is rendered on whichever
 * background the reader's GitHub theme picks, and only a drawing carrying its
 * own ground is legible on both. Literals rather than custom properties because
 * an export has to survive renderers thinner than a browser - resvg, which
 * powers most SVG-to-raster pipelines, drops `var()` and paints the fallback
 * black.
 *
 * Run `npm run export-readme-diagrams` after changing a source diagram.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = join(SITE_ROOT, '..');

/** Which diagram lands where, and in which language. */
const EXPORTS = [
  { diagram: 'bmad-delivery-loop', out: 'docs/images/bmad-delivery-loop.svg' },
  { diagram: 'bmad-delivery-loop', out: 'docs/images/bmad-delivery-loop-ko.svg', lang: 'ko-KR' },
];

/**
 * The dark ramp, resolved. These are the values `custom.css` gives the
 * `--dg-*` tokens under `:root[data-theme='dark']`; keep the two in step.
 */
const RAMP = {
  surface: '#1a1e24',
  line: '#404854',
  ink: '#e6eaf0',
  muted: '#8c96a3',
  edge: '#8c96a3',
  ground: '#111418',
  accent: '#7fa0ff',
  ok: '#6fcf97',
  'ok-tint': 'rgba(111, 207, 151, 0.1)',
  warn: '#e0b25f',
  'warn-tint': 'rgba(224, 178, 95, 0.1)',
};

const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/** The class vocabulary from `custom.css`, with the ramp already substituted. */
const STYLE = `
  .bmad-diagram { font-family: ${SANS}; }
  .bmad-diagram text { fill: ${RAMP.ink}; }
  .bmad-diagram .node { fill: ${RAMP.surface}; stroke: ${RAMP.line}; stroke-width: 1; }
  .bmad-diagram .node.hot { stroke: ${RAMP.accent}; }
  .bmad-diagram .gate { fill: ${RAMP.ground}; stroke: ${RAMP.accent}; stroke-width: 1.5; }
  .bmad-diagram .chip { fill: ${RAMP.surface}; stroke: ${RAMP.line}; stroke-width: 1; }
  .bmad-diagram .chip.ok { fill: ${RAMP['ok-tint']}; stroke: ${RAMP.ok}; }
  .bmad-diagram .chip.warn { fill: ${RAMP['warn-tint']}; stroke: ${RAMP.warn}; }
  .bmad-diagram .band { fill: ${RAMP.surface}; stroke: ${RAMP.line}; stroke-opacity: 0.28; stroke-width: 1; }
  .bmad-diagram .panel { fill: none; stroke: ${RAMP.line}; stroke-width: 1; stroke-dasharray: 4 4; }
  .bmad-diagram .panel-title { fill: ${RAMP.accent}; }
  .bmad-diagram .slogan {
    font-family: ${MONO};
    font-size: 16px;
    letter-spacing: 0.085em;
    text-transform: uppercase;
    fill: ${RAMP.accent};
  }
  .bmad-diagram .slogan.alt { fill: ${RAMP.muted}; }
  .bmad-diagram .rule { fill: none; stroke: ${RAMP.line}; stroke-width: 1; }
  .bmad-diagram .edge { fill: none; stroke: ${RAMP.edge}; stroke-width: 1.5; }
  .bmad-diagram .edge.soft { stroke-width: 1.25; stroke-dasharray: 4 4; opacity: 0.85; }
  .bmad-diagram .edge.lens { opacity: 0.5; }
  .bmad-diagram .edge.entry { stroke: ${RAMP.accent}; }
  .bmad-diagram .head { fill: ${RAMP.edge}; }
  .bmad-diagram .head.accent { fill: ${RAMP.accent}; }
  .bmad-diagram .glyph { fill: ${RAMP.muted}; }
  .bmad-diagram .glyph .fold { fill: ${RAMP.ground}; opacity: 0.5; }
  .bmad-diagram .n { font-size: 14px; font-weight: 500; letter-spacing: -0.012em; text-anchor: middle; }
  .bmad-diagram .n.small { font-size: 12.5px; font-weight: 600; text-anchor: start; }
  .bmad-diagram .sub { font-size: 11.5px; fill: ${RAMP.muted}; }
  .bmad-diagram .sub.mid { text-anchor: middle; }
  .bmad-diagram .mono { font-family: ${MONO}; }
  .bmad-diagram .k {
    font-family: ${MONO};
    font-size: 10px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    fill: ${RAMP.muted};
  }
`;

/** Escape a translated label for use as SVG text content. */
function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Swap each `data-i18n` label for its translation, keeping the authored
 * English wherever one is missing — the same rule the docs site applies.
 */
function translate(svg, strings) {
  return svg.replaceAll(/(<text\b[^>]*\bdata-i18n="([\w-]+)"[^>]*>)([^<]*)(<\/text>)/g, (whole, open, key, text, close) =>
    strings[key] ? `${open}${escapeXml(strings[key])}${close}` : whole,
  );
}

/** Substitute every `var(--dg-*)` in the geometry for its literal colour. */
function resolveTokens(svg) {
  return svg.replaceAll(/var\(--dg-([\w-]+)\)/g, (whole, token) => {
    const colour = RAMP[token];
    if (!colour) throw new Error(`diagram names an unknown token: --dg-${token}`);
    return colour;
  });
}

/**
 * Carry the class vocabulary in, and paint a ground behind the drawing.
 *
 * The ground is one flat fill. A gradient was tried here and read as an effect
 * rather than a surface; the drawing's colour is the accent on the entry drops,
 * and it says more with nothing competing behind it.
 */
function standalone(svg) {
  const width = /\bwidth="(\d+)"/.exec(svg)?.[1];
  const height = /\bheight="(\d+)"/.exec(svg)?.[1];
  if (!width || !height) throw new Error('diagram has no intrinsic width and height');

  const ground = `<rect width="${width}" height="${height}" rx="20" fill="${RAMP.ground}"/>`;
  return resolveTokens(svg).replace(/(<svg\b[^>]*>)/, `$1\n  <style>${STYLE}  </style>\n  ${ground}`);
}

for (const { diagram, out, lang } of EXPORTS) {
  const source = join(SITE_ROOT, 'src', 'diagrams', `${diagram}.svg`);
  const labelsPath = join(SITE_ROOT, 'src', 'diagrams', `${diagram}.labels.json`);
  const labels = JSON.parse(readFileSync(labelsPath, 'utf8'));

  const svg = standalone(translate(readFileSync(source, 'utf8'), (lang && labels[lang]) || {}));
  const target = join(REPO_ROOT, out);
  writeFileSync(target, svg);
  console.log(`wrote ${out}${lang ? ` (${lang})` : ''}`);
}
