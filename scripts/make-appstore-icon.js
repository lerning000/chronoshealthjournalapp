const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source icon paths (try different possible locations)
const possibleSources = [
  path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset/AppIcon-1024.png'),
  path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset/AppIcon-60x60@3x.png'),
  path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset/AppIcon-60x60@2x.png'),
  path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset/app_icon.png'),
];

// Output path
const out = path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset/AppIcon-1024.png');

// Find the first existing source file
let input = null;
for (const source of possibleSources) {
  if (fs.existsSync(source)) {
    input = source;
    break;
  }
}

if (!input) {
  console.error('❌ No source icon found. Please ensure you have an icon file in the AppIcon.appiconset directory.');
  process.exit(1);
}

// If the input is the same as output, create a temporary file first
const tempOutput = input === out ? path.resolve('temp-appstore-icon.png') : out;

sharp(input)
  .resize({ width: 1024, height: 1024, fit: 'contain', background: '#000000' })
  .removeAlpha()
  .flatten({ background: '#000000' })
  .png()
  .toFile(tempOutput)
  .then(() => {
    // If we used a temp file, move it to the final location
    if (tempOutput !== out) {
      fs.renameSync(tempOutput, out);
    }
    console.log('✅ Wrote 1024x1024 App Store icon:', out);
  })
  .catch(err => { 
    console.error('❌ Error generating App Store icon:', err); 
    process.exit(1); 
  });
