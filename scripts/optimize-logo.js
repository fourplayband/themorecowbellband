// Requires: npm install sharp fs-extra
// Run: node scripts/optimize-logo.js
const sharp = require('sharp');
const fs = require('fs-extra');

(async function(){
  try{
    const inPath = 'assets/logo-cowbell.png';
    const outPath = 'assets/logo-cowbell.webp';
    if(!await fs.pathExists(inPath)) return console.error('logo not found:', inPath);
    await sharp(inPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outPath);
    console.log('wrote', outPath);
  }catch(err){ console.error(err); }
})();
