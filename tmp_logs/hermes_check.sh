#!/bin/bash

echo "=== HERMES SANITY CHECKS ==="
echo ""

FAILED=0
HERMES_FILES=""

# Check for Hermes footprints
echo "Searching for Hermes footprints..."
echo "-----------------------------------"

# Search patterns
patterns=(
  "hermes-engine"
  "React-RuntimeHermes"
  "React-hermes"
  "makeHermesRuntime"
  "USE_HERMES = YES"
  '-framework "hermes"'
)

for pattern in "${patterns[@]}"; do
  echo "Checking for: $pattern"
  files=$(grep -r "$pattern" ios/Pods/Target\ Support\ Files/ 2>/dev/null | cut -d: -f1 | sort -u || true)
  if [ -n "$files" ]; then
    echo "  ⚠️  FOUND in:"
    echo "$files" | sed 's/^/    - /'
    HERMES_FILES="$HERMES_FILES\n$pattern:\n$files"
    FAILED=1
  else
    echo "  ✅ Not found"
  fi
done

echo ""
echo "Verifying JSC settings..."
echo "-----------------------------------"

# Check for USE_HERMES = NO
use_hermes_no=$(grep -r "USE_HERMES = NO" ios/Pods/Target\ Support\ Files/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$use_hermes_no" -gt 0 ]; then
  echo "✅ USE_HERMES = NO found ($use_hermes_no occurrences)"
else
  echo "❌ USE_HERMES = NO not found"
  FAILED=1
fi

# Check for USE_JSC = YES
use_jsc_yes=$(grep -r "USE_JSC = YES" ios/Pods/Target\ Support\ Files/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$use_jsc_yes" -gt 0 ]; then
  echo "✅ USE_JSC = YES found ($use_jsc_yes occurrences)"
else
  echo "❌ USE_JSC = YES not found"
  FAILED=1
fi

echo ""
if [ $FAILED -eq 1 ]; then
  echo "STATUS: HERMES_FOUND"
  echo ""
  echo "Files with Hermes references:"
  echo -e "$HERMES_FILES"
  exit 1
else
  echo "STATUS: JSC_ONLY_OK"
  exit 0
fi
