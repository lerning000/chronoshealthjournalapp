#!/bin/bash
set -e

# Fix node_modules permissions
chmod -R 755 node_modules 2>/dev/null || true

# Fix CocoaPods permissions
chmod -R 755 ios/Pods 2>/dev/null || true

echo "Permissions fixed successfully"
