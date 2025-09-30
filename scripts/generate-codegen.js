#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Generating React Native codegen files...');

const projectRoot = path.resolve(__dirname, '..');
const iosDir = path.join(projectRoot, 'ios');
const generatedDir = path.join(iosDir, 'build', 'generated', 'ios');

// Ensure the generated directory exists
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
  console.log('📁 Created generated directory:', generatedDir);
}

// Set environment variables for codegen
process.env.RCT_NEW_ARCH_ENABLED = '0';
process.env.RCT_FABRIC_ENABLED = '0';

try {
  // Generate codegen artifacts
  const codegenScript = path.join(projectRoot, 'node_modules', 'react-native', 'scripts', 'generate-codegen-artifacts.js');
  
  if (fs.existsSync(codegenScript)) {
    console.log('🚀 Running codegen script...');
    execSync(`node "${codegenScript}" -p "${projectRoot}" -t ios -o "${generatedDir}"`, {
      stdio: 'inherit',
      cwd: projectRoot
    });
    console.log('✅ Codegen files generated successfully!');
  } else {
    console.log('⚠️  Codegen script not found, trying alternative approach...');
    
    // Alternative: run pod install to trigger codegen
    console.log('📦 Running pod install...');
    execSync('pod install', {
      stdio: 'inherit',
      cwd: iosDir
    });
  }
  
  // Verify generated files
  const generatedFiles = fs.readdirSync(generatedDir, { recursive: true });
  console.log('📋 Generated files:', generatedFiles.length);
  
  if (generatedFiles.length > 0) {
    console.log('✅ Codegen generation completed successfully!');
  } else {
    console.log('❌ No codegen files were generated');
  }
  
} catch (error) {
  console.error('❌ Error generating codegen files:', error.message);
  process.exit(1);
}
