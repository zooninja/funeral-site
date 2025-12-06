const fs = require('fs');
const path = require('path');

// Check if sharp is available
try {
  const sharp = require('sharp');

  const inputPath = path.join(__dirname, 'img', 'hero.png');
  const outputPathWebP = path.join(__dirname, 'img', 'hero.webp');
  const outputPathJPG = path.join(__dirname, 'img', 'hero-optimized.jpg');

  console.log('Optimizing image with sharp...');

  // Create WebP version (best compression)
  sharp(inputPath)
    .resize(1920, 1080, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toFile(outputPathWebP)
    .then(() => {
      const stats = fs.statSync(outputPathWebP);
      console.log(`✓ Created hero.webp (${(stats.size / 1024).toFixed(0)}KB)`);
    })
    .catch(err => console.error('WebP error:', err));

  // Create optimized JPG as fallback
  sharp(inputPath)
    .resize(1920, 1080, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 85, progressive: true })
    .toFile(outputPathJPG)
    .then(() => {
      const stats = fs.statSync(outputPathJPG);
      console.log(`✓ Created hero-optimized.jpg (${(stats.size / 1024).toFixed(0)}KB)`);
    })
    .catch(err => console.error('JPG error:', err));

} catch (err) {
  console.log('Sharp not installed. Installing...');
  console.log('Run: npm install sharp');
  process.exit(1);
}
