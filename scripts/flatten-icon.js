const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const src = path.resolve('ios/ChronosApp/Images.xcassets/AppIcon.appiconset/AppIcon-1024.png');
const tempFile = src.replace('.png', '.temp.png');

// Process the image and save to temp file first
sharp(src)
  .ensureAlpha()         // ensure we have alpha to replace
  .removeAlpha()         // drop alpha altogether
  .flatten({ background: '#000000' }) // hard black background
  .toFile(tempFile)
  .then(() => {
    // Replace original with processed file
    fs.renameSync(tempFile, src);
    console.log('Icon flattened (no alpha).');
  })
  .catch(err => { 
    // Clean up temp file on error
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    console.error(err); 
    process.exit(1); 
  });
