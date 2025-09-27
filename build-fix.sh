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

# 3. Reinstall Node Dependencies (creates the missing react-native.sh script)
echo "3. Installing Node dependencies with npm..."
npm install

# 4. Apply Execute Permissions (the fix for EPERM errors)
# This step MUST run AFTER npm install
REACT_NATIVE_SH_PATH="node_modules/react-native/scripts/react-native.sh"
if [ -f "$REACT_NATIVE_SH_PATH" ]; then
    echo "4. Granting execute permission to $REACT_NATIVE_SH_PATH"
    chmod +x "$REACT_NATIVE_SH_PATH"
else
    echo "ERROR: React Native script not found at $REACT_NATIVE_SH_PATH after npm install."
    exit 1
fi

# 5. Reinstall CocoaPods Dependencies
echo "5. Installing CocoaPods (native iOS dependencies)..."
cd ios
pod install
cd ..

echo "--- Cleanup and reinstall complete. You can now try 'Product -> Archive' in Xcode. ---"
