# Auto-Save Journal Implementation

## Overview
The Journal app now features a complete auto-save system with midnight rollover and draft persistence.

## Key Features

### 1. Draft System
- **Draft Storage**: Temporary storage keyed by `draft:YYYY-MM-DD`
- **Auto-Save**: Text saves with 500ms debounce, ratings save immediately
- **Merge Logic**: New changes merge with existing draft data

### 2. Midnight Rollover
- **Automatic Finalization**: At midnight, drafts become permanent entries
- **Date Change Detection**: Handles day changes via timer and app state
- **Clean State Reset**: New day starts with empty/null values

### 3. Background/Foreground Handling
- **App State Monitoring**: Detects when app returns from background
- **Date Validation**: Checks if date changed while app was inactive
- **Automatic Finalization**: Finalizes previous day on date change

### 4. Null Value Support
- **Empty Ratings**: Ratings show as empty circles until user selects
- **Proper Typing**: `null` values handled throughout the system
- **Visual Feedback**: Clear distinction between unset and zero ratings

## Usage Flow

1. **App Launch**: Loads draft for today or starts empty
2. **User Input**: Text auto-saves with debounce, ratings save immediately
3. **Background**: Draft persists when app goes to background
4. **Foreground**: Checks date, finalizes if day changed
5. **Midnight**: Automatically finalizes current day, starts fresh

## Storage Structure

```typescript
// Draft (temporary)
draft:2024-01-15 -> {
  date: "2024-01-15",
  physical: 8,
  mental: 7,
  text: "User's thoughts...",
  updatedAt: 1642204800000
}

// Entry (permanent after finalization)
journal_entries -> [{
  id: "2024-01-15-1642204800000",
  date: "2024-01-15",
  physical: 8,
  mental: 7,
  text: "User's thoughts...",
  updatedAt: 1642204800000
}]
```

## Testing Scenarios

### ✅ Same Day Persistence
- Type text, set ratings → quit app → relaunch same day
- **Expected**: Draft content reappears exactly as left

### ✅ Midnight Rollover
- Use app until midnight (or simulate with shorter timer)
- **Expected**: Previous day becomes permanent entry, new day starts empty

### ✅ Empty State Handling
- Ratings show empty circles until user taps
- **Expected**: No filled dots when rating is null

### ✅ Background/Foreground
- Use app, go to background, wait for date change, return
- **Expected**: Previous day finalized, new day starts fresh

## Technical Implementation

- **Storage**: MMKV for high-performance local persistence
- **Debouncing**: 500ms for text, immediate for ratings
- **Timers**: Automatic midnight scheduling with cleanup
- **State Management**: React hooks with proper cleanup
- **Type Safety**: Full TypeScript support with proper null handling
