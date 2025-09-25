# Fixes Applied & Recovery Steps

## Terminal Recovery Steps

### Quick Recovery (Most Common Issues)

1. **Close Simulator** - Kill any running iOS Simulator instances
2. **Run restart script:**
   ```bash
   npm run restart
   ```
   Or for alternative port:
   ```bash
   npm run restart:8082
   npm run ios:8082
   ```
3. **If Cursor terminal is unresponsive:** 
   - Cursor → Help → Reload Window
4. **If iOS build errors about pods:**
   ```bash
   npx pod-install ios
   ```
   Then restart with `npm run restart`

### Available Scripts

- `npm run restart` - Standard Metro restart (port 8081)
- `npm run restart:8082` - Restart Metro on port 8082
- `npm run ios:8082` - Run iOS app with port 8082
- `npm run doctor` - Check environment versions

### What the Restart Scripts Do

- Kill processes on port 8081 safely
- Clear watchman cache
- Remove Metro temp files
- Reset Metro cache
- Start fresh Metro bundler

### Environment Check

Run `npm run doctor` to verify:
- Node.js version
- npm version  
- Watchman version
- Xcode version

## Layout & Styling Fixes Applied

### Shared Sizing Constants (`src/theme/sizes.ts`)
- `entryBoxHeight: 240` - Consistent entry box height
- `headerMaxWidth: 420` - Max width for header sections
- `headerGap: 12` - Horizontal gap between header elements
- `sectionGap: 24` - Vertical spacing between sections
- `pageBottomPad: 36` - Bottom padding for ScrollViews

### Visual Polish Applied
- Label spacing: `marginBottom: 8` (was 6px) for better separation
- Consistent styling across Journal and Past Entries screens
- Responsive layout with proper max-width constraints
- Professional spacing and typography

### ScrollView Improvements
- Proper `contentContainerStyle` with bottom padding
- `keyboardShouldPersistTaps="handled"` for better UX
- Fixed height entry boxes to prevent compression
- Vertical column layout without horizontal compression

## Storage & Data Management

### Content Detection
- `hasContent()` helper prevents saving empty entries
- `finalizeDate()` only saves entries with meaningful content
- Auto-save with debouncing for text input
- Midnight rollover with proper state management

### Development Features
- `seedDummyEntries()` for testing Past Entries functionality
- `finalizeTodayNow()` dev-only helper for testing finalization
- Long-press on date title triggers finalization (dev only)

## File Structure

```
src/
├── theme/
│   ├── colors.ts
│   └── sizes.ts
├── storage/
│   └── entries.ts
└── components/
    └── ModalPicker.tsx
```

## Notes

- All storage imports use `./src/storage/entries` path
- Shared constants ensure consistent styling across screens
- Proper error handling and graceful failures in scripts
- macOS-optimized bash commands for development workflow