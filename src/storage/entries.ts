import { MMKV } from 'react-native-mmkv';

// Initialize MMKV storage
const storage = new MMKV();

// Storage key for entries
const ENTRIES_KEY = 'journal_entries';

// Helper function to get all entries from storage
function getAllEntriesFromStorage(): Entry[] {
  try {
    const entriesJson = storage.getString(ENTRIES_KEY);
    if (!entriesJson) {
      return [];
    }
    return JSON.parse(entriesJson);
  } catch (error) {
    if (__DEV__) {
      console.error('Error parsing entries from storage:', error);
    }
    return [];
  }
}

// Helper function to save all entries to storage
function saveAllEntriesToStorage(entries: Entry[]): void {
  try {
    storage.set(ENTRIES_KEY, JSON.stringify(entries));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving entries to storage:', error);
    }
  }
}

// Returns true if the draft/entry has any meaningful content
export function hasContent(params: {
  physical?: number | null;
  mental?: number | null;
  text?: string | null | undefined;
}): boolean {
  const p = typeof params.physical === 'number' ? params.physical : 0;
  const m = typeof params.mental === 'number' ? params.mental : 0;
  const t = (params.text ?? '').trim();
  return p > 0 || m > 0 || t.length > 0;
}

export type Entry = {
  id: string;
  date: string;        // 'YYYY-MM-DD'
  physical: number;    // 0..10
  mental: number;      // 0..10
  text: string;
  updatedAt: number;   // epoch ms
};

export type Draft = {
  date: string;             // 'YYYY-MM-DD'
  physical?: number | null; // 0..10 or null when unset
  mental?: number | null;   // 0..10 or null when unset
  text?: string;            // current text (may be empty)
  updatedAt: number;        // epoch ms
};

/**
 * Get all journal entries
 * @returns Array of all entries sorted by date (newest first)
 */
export function getEntries(): Entry[] {
  const entries = getAllEntriesFromStorage();
  // Sort by date descending (newest first)
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Get a specific entry by date
 * @param date Date string in 'YYYY-MM-DD' format
 * @returns Entry if found, undefined otherwise
 */
export function getEntryByDate(date: string): Entry | undefined {
  const entries = getAllEntriesFromStorage();
  return entries.find(entry => entry.date === date);
}

/**
 * Insert or update an entry
 * @param entry The entry to insert or update
 */
export function upsertEntry(entry: Entry): void {
  const entries = getAllEntriesFromStorage();
  
  // Find existing entry by ID or date
  const existingIndex = entries.findIndex(e => e.id === entry.id || e.date === entry.date);
  
  if (existingIndex >= 0) {
    // Update existing entry
    entries[existingIndex] = {
      ...entry,
      updatedAt: Date.now()
    };
  } else {
    // Add new entry
    entries.push({
      ...entry,
      updatedAt: Date.now()
    });
  }
  
  // Save back to storage
  saveAllEntriesToStorage(entries);
}

/**
 * Delete an entry by ID
 * @param id The ID of the entry to delete
 */
export function deleteEntry(id: string): void {
  const entries = getAllEntriesFromStorage();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  
  // Save updated entries back to storage
  saveAllEntriesToStorage(filteredEntries);
}

/**
 * Get a draft for a specific date
 * @param date Date string in 'YYYY-MM-DD' format
 * @returns Draft if found, null otherwise
 */
export function getDraft(date: string): Draft | null {
  try {
    const draftKey = `draft:${date}`;
    const draftJson = storage.getString(draftKey);
    if (!draftJson) {
      return null;
    }
    return JSON.parse(draftJson);
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting draft:', error);
    }
    return null;
  }
}

/**
 * Save a draft for a specific date (merge with existing)
 * @param partial Partial draft data with date
 */
export function saveDraft(partial: Partial<Draft> & { date: string }): void {
  try {
    const { date } = partial;
    const draftKey = `draft:${date}`;
    
    // Get existing draft
    const existingDraft = getDraft(date);
    
    // Merge with new data
    const mergedDraft: Draft = {
      ...existingDraft,
      ...partial,
      date,
      updatedAt: Date.now(),
    };
    
    // Save back to storage
    storage.set(draftKey, JSON.stringify(mergedDraft));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving draft:', error);
    }
  }
}

/**
 * Clear a draft for a specific date
 * @param date Date string in 'YYYY-MM-DD' format
 */
export function clearDraft(date: string): void {
  try {
    const draftKey = `draft:${date}`;
    storage.delete(draftKey);
  } catch (error) {
    if (__DEV__) {
      console.error('Error clearing draft:', error);
    }
  }
}

/**
 * Finalize a draft into a real Entry for its date
 * Only finalizes if at least one field has content
 * @param date Date string in 'YYYY-MM-DD' format
 */
export function finalizeDate(date: string): void {
  try {
    const draft = getDraft(date);
    if (!draft) {
      return; // No draft to finalize
    }
    
    // Check if draft has any meaningful content
    if (!hasContent(draft)) {
      clearDraft(date);
      return; // Nothing to save, no empty entry written
    }
    
    // Get existing entry to preserve ID if it exists
    const existingEntry = getEntryByDate(date);
    
    // Create entry from draft
    const entry: Entry = {
      id: existingEntry?.id ?? `${date}-${Date.now()}`,
      date,
      physical: Number.isFinite(draft.physical) ? draft.physical! : 0,
      mental: Number.isFinite(draft.mental) ? draft.mental! : 0,
      text: (draft.text ?? '').trim(),
      updatedAt: Date.now(),
    };
    
    // Save the entry
    upsertEntry(entry);
    
    // Clear the draft
    clearDraft(date);
  } catch (error) {
    if (__DEV__) {
      console.error('Error finalizing date:', error);
    }
  }
}

/**
 * Seed dummy entries for testing if they don't already exist
 */
export function seedDummyEntries(): void {
  try {
    // Check if dummy entries already exist
    const existingEntries = getAllEntriesFromStorage();
    const hasAug3Entry = existingEntries.some(entry => entry.date === '2024-08-03');
    const hasSep7Entry = existingEntries.some(entry => entry.date === '2023-09-07');
    
    // Create dummy entry for 2024-08-03
    if (!hasAug3Entry) {
      const aug3Entry: Entry = {
        id: '2024-08-03-dummy',
        date: '2024-08-03',
        physical: 7,
        mental: 5,
        text: 'Dummy entry for August 3rd, 2024',
        updatedAt: Date.now(),
      };
      upsertEntry(aug3Entry);
    }
    
    // Create dummy entry for 2023-09-07
    if (!hasSep7Entry) {
      const sep7Entry: Entry = {
        id: '2023-09-07-dummy',
        date: '2023-09-07',
        physical: 3,
        mental: 8,
        text: 'Dummy entry for September 7th, 2023',
        updatedAt: Date.now(),
      };
      upsertEntry(sep7Entry);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Error seeding dummy entries:', error);
    }
  }
}

// Helper for convenience - clears draft if it has no content
export function clearIfEmpty(date: string): void {
  const d = getDraft(date);
  if (!d) return;
  if (!hasContent(d)) clearDraft(date);
}
