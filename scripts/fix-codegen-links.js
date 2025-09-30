#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔗 Creating symbolic links for React Native codegen files...');

const generatedDir = path.join(__dirname, '..', 'ios', 'build', 'generated', 'ios');

if (!fs.existsSync(generatedDir)) {
  console.log('❌ Generated directory does not exist. Run pod install first.');
  process.exit(1);
}

// Create symbolic links for files that Xcode expects with different names
const links = [
  {
    target: 'rnscreensJSI-generated.cpp',
    link: 'rnscreens-JSI-generated.cpp'
  },
  {
    target: 'safeareacontextJSI-generated.cpp', 
    link: 'safeareacontext-JSI-generated.cpp'
  },
  {
    target: 'RNMmkvSpecJSI-generated.cpp',
    link: 'RNMmkvSpec-JSI-generated.cpp'
  },
  {
    target: 'rnscreens/rnscreens-generated.mm',
    link: 'rnscreens-generated.mm'
  },
  {
    target: 'safeareacontext/safeareacontext-generated.mm',
    link: 'safeareacontext-generated.mm'
  }
];

links.forEach(({ target, link }) => {
  const targetPath = path.join(generatedDir, target);
  const linkPath = path.join(generatedDir, link);
  
  if (fs.existsSync(targetPath)) {
    if (fs.existsSync(linkPath)) {
      fs.unlinkSync(linkPath);
    }
    fs.symlinkSync(target, linkPath);
    console.log(`✅ Created link: ${link} -> ${target}`);
  } else {
    console.log(`⚠️  Target file not found: ${target}`);
  }
});

console.log('🎉 Codegen symbolic links created successfully!');
