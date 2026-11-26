// Генерирует иконки и splash-экраны из одного векторного знака.
// Запуск: npm run icons
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve(fileURLToPath(new URL('../public/icons/', import.meta.url)));
await mkdir(OUT, { recursive: true });
const out = (name) => path.join(OUT, name);

const mark = (transform = '') => `
  <g transform="${transform}">
    <g fill="none" stroke="#ffffff" stroke-linecap="round">
      <circle cx="256" cy="256" r="136" stroke-width="22"/>
      <circle cx="256" cy="256" r="70" stroke-width="16"/>
      <g stroke-width="15">
        <path d="M256 120v48M256 344v48M120 256h48M344 256h48"/>
        <path d="M160 160l36 36M316 316l36 36M352 160l-36 36M196 316l-36 36"/>
      </g>
    </g>
    <circle cx="256" cy="256" r="24" fill="#0e8a5f"/>
  </g>`;

const defs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c01a32"/>
      <stop offset="0.55" stop-color="#a3162e"/>
      <stop offset="1" stop-color="#71101f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.16" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

function iconSvg(size, { rounded = true, safe = false } = {}) {
  const rx = rounded ? Math.round(size * 0.225) : 0;
  const scale = safe ? 0.62 : 0.8;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    ${defs}
    <rect width="512" height="512" rx="${rx}" fill="url(#bg)"/>
    <rect width="512" height="512" rx="${rx}" fill="url(#glow)"/>
    <circle cx="256" cy="256" r="${safe ? 196 : 218}" fill="#ffffff" opacity="0.055"/>
    ${mark(`translate(256 256) scale(${scale}) translate(-256 -256)`)}
  </svg>`;
}

function splashSvg(width, height) {
  const logoScale = Math.min(width, height) * 0.00078;
  const cx = width / 2;
  const cy = Math.round(height * 0.4);
  const titleSize = Math.round(width * 0.076);
  const subtitleSize = Math.round(width * 0.026);
  const footerSize = Math.round(width * 0.019);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${defs}
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <g fill="none" stroke="#ffffff" stroke-opacity="0.055" stroke-width="${Math.round(width * 0.003)}">
      <circle cx="${cx}" cy="${cy}" r="${Math.round(width * 0.38)}"/>
      <circle cx="${cx}" cy="${cy}" r="${Math.round(width * 0.52)}"/>
      <circle cx="${cx}" cy="${cy}" r="${Math.round(width * 0.68)}"/>
    </g>
    ${mark(`translate(${cx} ${cy}) scale(${logoScale}) translate(-256 -256)`)}
    <text x="${cx}" y="${Math.round(height * 0.57)}" text-anchor="middle"
      font-family="DejaVu Serif, Georgia, serif" font-weight="bold"
      font-size="${titleSize}" fill="#ffffff">Культурология</text>
    <text x="${cx}" y="${Math.round(height * 0.615)}" text-anchor="middle"
      font-family="DejaVu Sans, Arial, sans-serif" font-size="${subtitleSize}"
      letter-spacing="${Math.round(subtitleSize * 0.06)}" fill="#ffffff" fill-opacity="0.8">300 вопросов · 10 разделов</text>
    <line x1="${cx - width * 0.06}" y1="${height - footerSize * 5.4}" x2="${cx + width * 0.06}" y2="${height - footerSize * 5.4}"
      stroke="#ffffff" stroke-opacity="0.28" stroke-width="${Math.max(1, Math.round(width * 0.0012))}"/>
    <text x="${cx}" y="${height - footerSize * 3.5}" text-anchor="middle"
      font-family="DejaVu Sans, Arial, sans-serif" font-size="${footerSize}"
      letter-spacing="${Math.round(footerSize * 0.22)}" fill="#ffffff" fill-opacity="0.55">ТРЕНАЖЁР</text>
  </svg>`;
}

const png = (svg) => sharp(Buffer.from(svg), { density: 192 }).png({ compressionLevel: 9 });

await png(iconSvg(512)).toFile(out('icon-512.png'));
await png(iconSvg(192)).toFile(out('icon-192.png'));
await png(iconSvg(180, { rounded: false })).toFile(out('apple-touch-icon.png'));
await png(iconSvg(512, { rounded: false, safe: true })).toFile(out('maskable-512.png'));
await png(iconSvg(64, { rounded: true })).resize(32, 32).toFile(out('favicon-32.png'));

await writeFile(
  out('favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    ${defs}
    <rect width="512" height="512" rx="116" fill="url(#bg)"/>
    ${mark('translate(256 256) scale(0.78) translate(-256 -256)')}
  </svg>\n`,
);

for (const [w, h] of [
  [1170, 2532],
  [1176, 2556],
  [1290, 2796],
]) {
  await png(splashSvg(w, h)).toFile(out(`splash-${w}x${h}.png`));
}

console.log('Icons and splash screens written to public/icons/');
