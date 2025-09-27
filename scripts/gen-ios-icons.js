// scripts/gen-ios-icons.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset/AppIcon-1024.png');
const outDir = path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset');

if (!fs.existsSync(src)) {
  console.error('Source icon not found at:', src);
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// iPhone icon sizes (points x scale -> pixels)
const slots = [
  { idiom: 'iphone', size: 20, scales: [2, 3] },
  { idiom: 'iphone', size: 29, scales: [2, 3] },
  { idiom: 'iphone', size: 40, scales: [2, 3] },
  { idiom: 'iphone', size: 60, scales: [2, 3] }, // 60pt @2x=120, @3x=180
];

const images = [];

async function run() {
  // Generate all iPhone sizes
  for (const { idiom, size, scales } of slots) {
    for (const scale of scales) {
      const px = size * scale;
      const filename = `AppIcon-${size}x${size}@${scale}x.png`;
      images.push({ idiom, size: `${size}x${size}`, scale: `${scale}x`, filename });

      await sharp(src).resize(px, px).png().toFile(path.join(outDir, filename));
    }
  }

  // Add iOS marketing 1024
  images.push({
    idiom: 'ios-marketing',
    size: '1024x1024',
    scale: '1x',
    filename: 'AppIcon-1024.png',
  });

  const contents = {
    images,
    info: { version: 1, author: 'xcode' },
  };

  fs.writeFileSync(path.join(outDir, 'Contents.json'), JSON.stringify(contents, null, 2));
  console.log('✔ Generated iOS AppIcon set at', outDir);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
