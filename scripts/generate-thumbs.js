// Requires: npm install sharp glob fs-extra
// Run: node scripts/generate-thumbs.js
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');

const SOURCE_GLOB = 'assets/uploads/**/photos/**/*.{jpg,jpeg,png}';
const OUT_SUFFIX = 'thumbs';

async function processFile(file){
  try{
    const rel = file.replace(/\\/g, '/');
    const dir = path.dirname(rel);
    const base = path.basename(rel);
    const name = base.replace(/\.[^/.]+$/, '');
    const outDir = path.join(dir, OUT_SUFFIX);
    await fs.ensureDir(outDir);
    const outPath = path.join(outDir, name + '.webp');
    // skip if up-to-date
    const srcStat = await fs.stat(file);
    if(await fs.pathExists(outPath)){
      const outStat = await fs.stat(outPath);
      if(outStat.mtimeMs >= srcStat.mtimeMs) return;
    }
    await sharp(file)
      .resize(500, 500, { fit: 'inside' })
      .webp({ quality: 75 })
      .toFile(outPath);
    console.log('wrote', outPath);
  }catch(err){ console.error('err', file, err); }
}

glob('assets/uploads/**/*.{jpg,jpeg,png}', async function(err, files){
  if(err) return console.error(err);
  for(const f of files){ await processFile(f); }
  console.log('done');
});
