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
    console.error('Error parsing entries from storage:', error);
    return [];
  }
}

// Helper function to save all entries to storage
function saveAllEntriesToStorage(entries: Entry[]): void {
  try {
    storage.set(ENTRIES_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving entries to storage:', error);
  }
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
    console.error('Error getting draft:', error);
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
    console.error('Error saving draft:', error);
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
    console.error('Error clearing draft:', error);
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
    
    // Check if draft has any content worth saving
    const hasContent = 
      (draft.text && draft.text.trim().length > 0) ||
      (typeof draft.physical === 'number') ||
      (typeof draft.mental === 'number');
    
    if (!hasContent) {
      clearDraft(date);
      return; // Nothing to save
    }
    
    // Get existing entry to preserve ID if it exists
    const existingEntry = getEntryByDate(date);
    
    // Create entry from draft
    const entry: Entry = {
      id: existingEntry?.id ?? `${date}-${Date.now()}`,
      date,
      physical: typeof draft.physical === 'number' ? draft.physical : 0,
      mental: typeof draft.mental === 'number' ? draft.mental : 0,
      text: draft.text ?? '',
      updatedAt: Date.now(),
    };
    
    // Save the entry
    upsertEntry(entry);
    
    // Clear the draft
    clearDraft(date);
  } catch (error) {
    console.error('Error finalizing date:', error);
  }
}
