#!/bin/bash

# Stop immediately if any command fails
set -e

echo "--- Starting Full Build Fix Script ---"

# 1. Full Cleanup: Delete dependencies and build artifacts
echo "1. Cleaning up node modules and build artifacts..."
rm -rf node_modules package-lock.json ios/build

# 2. Cleanup iOS specific files
echo "2. Cleaning up CocoaPods files and .xcode.env..."
cd ios
rm -rf Pods Podfile.lock .xcode.env
cd ..

# 3. Reinstall Node Dependencies
echo "3. Installing Node dependencies with npm..."
npm install

# 4. Reinstall CocoaPods Dependencies
echo "4. Installing CocoaPods (native iOS dependencies)..."
cd ios
export LANG=en_US.UTF-8
pod install
cd ..

echo "--- Cleanup and reinstall complete. You can now try 'Product -> Archive' in Xcode. ---"

