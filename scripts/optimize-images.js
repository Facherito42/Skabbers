// Genera las variantes servidas en v5/images a partir de los originales de
// assets-src (que quedan fuera del deploy). Reejecutar tras agregar una foto.
//
//   node scripts/optimize-images.js
//
// Formatos: AVIF en todos los anchos (lo recibe ~93% de los navegadores), WebP
// en todos los anchos como fallback, y un unico JPG de respaldo por imagen para
// el resto. Generar JPG en cada ancho triplicaba el peso del repo para cubrir
// una porcion de trafico marginal.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "v5", "images");

// Calidades apuntadas a PSNR > 40dB contra el original, umbral a partir del
// cual la diferencia deja de ser perceptible.
const AVIF = { quality: 74, effort: 6, chromaSubsampling: "4:4:4" };
const WEBP = { quality: 80, effort: 6 };
const JPG  = { quality: 82, mozjpeg: true };

// Los heroes ocupan el ancho completo; las fotos de producto viven en una grilla
// de ~480px por card, asi que con 960 alcanza incluso en pantallas 2x.
const STEPS = { hero: [1920, 1280, 900, 640], product: [960, 640, 480] };
const FALLBACK = { hero: 1280, product: 640 };

async function variants(src, outDir, name, kind){
  const meta = await sharp(src).metadata();
  const widths = [meta.width, ...STEPS[kind]]
    .filter((w, i, a) => w <= meta.width && a.indexOf(w) === i)
    .sort((a, b) => a - b);

  for (const w of widths){
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    const stem = path.join(outDir, `${name}-${w}`);
    await base.clone().avif(AVIF).toFile(`${stem}.avif`);
    await base.clone().webp(WEBP).toFile(`${stem}.webp`);
  }

  // Un solo JPG de respaldo, al ancho mas cercano al de referencia.
  const fb = widths.reduce((best, w) =>
    Math.abs(w - FALLBACK[kind]) < Math.abs(best - FALLBACK[kind]) ? w : best
  );
  await sharp(src).resize({ width: fb, withoutEnlargement: true }).jpeg(JPG)
    .toFile(path.join(outDir, `${name}-fallback.jpg`));

  return { meta, widths, original: fs.statSync(src).size };
}

async function run(){
  fs.mkdirSync(path.join(OUT, "products"), { recursive: true });

  // Limpieza: si cambian los anchos, no quedan variantes huerfanas dando vueltas.
  for (const dir of [OUT, path.join(OUT, "products")]){
    for (const f of fs.readdirSync(dir)){
      if (/\.(avif|webp|jpg)$/.test(f)) fs.unlinkSync(path.join(dir, f));
    }
  }

  const manifest = {};
  const report = [];

  for (const file of fs.readdirSync(SRC).filter(f => f.endsWith(".jpg"))){
    const name = path.basename(file, ".jpg");
    const { meta, widths, original } = await variants(path.join(SRC, file), OUT, name, "hero");
    manifest[name] = { w: meta.width, h: meta.height, widths };
    const full = fs.statSync(path.join(OUT, `${name}-${meta.width}.avif`)).size;
    report.push({
      archivo: name,
      dimensiones: `${meta.width}x${meta.height}`,
      originalMB: +(original / 1048576).toFixed(2),
      avifFullMB: +(full / 1048576).toFixed(2),
      reduccion: Math.round((1 - full / original) * 100) + "%"
    });
  }

  const pSrc = path.join(SRC, "products");
  for (const file of fs.readdirSync(pSrc).filter(f => f.endsWith(".jpg"))){
    const name = path.basename(file, ".jpg");
    const { meta, widths } = await variants(path.join(pSrc, file), path.join(OUT, "products"), name, "product");
    manifest[`products/${name}`] = { w: meta.width, h: meta.height, widths };
  }

  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

  let total = 0;
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(f => {
    const p = path.join(d, f.name);
    f.isDirectory() ? walk(p) : total += fs.statSync(p).size;
  });
  walk(OUT);

  console.table(report);
  console.log(`v5/images total: ${(total / 1048576).toFixed(1)}MB`);
}

run().catch(e => { console.error(e); process.exit(1); });
