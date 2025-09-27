/**
 * Health Journal App
 * Main journal entry screen with auto-save and midnight rollover
 *
 * @format
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  AppState,
  AppStateStatus,
  Pressable,
} from 'react-native';
import RatingSelector from './RatingSelector';
import { getDraft, saveDraft, finalizeDate, clearDraft, hasContent, Draft } from './src/storage/entries';
import { COLORS } from './src/theme/colors';
import { SIZES } from './src/theme/sizes';

// Helper function to format date as YYYY-MM-DD
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format date for display
const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to get next midnight timestamp
const getNextMidnightTimestamp = (): number => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Next midnight
  return midnight.getTime();
};

function JournalScreen() {
  const [physicalHealth, setPhysicalHealth] = useState<number | null>(null);
  const [mentalHealth, setMentalHealth] = useState<number | null>(null);
  const [entry, setEntry] = useState('');
  
  // Refs for tracking
  const currentDateRef = useRef<string>('');
  const textDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const midnightTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastOpenDateRef = useRef<string>('');

  // Dev-only helper to test finalization
  let finalizeTodayNow: (() => void) | undefined;
  if (__DEV__) {
    finalizeTodayNow = useCallback(() => {
      const todayStr = currentDateRef.current;
      finalizeDate(todayStr); // will only save if there's content
      setPhysicalHealth(null);
      setMentalHealth(null);
      setEntry('');
    }, []);
  }

  // Initialize today's date and load draft
  const initializeToday = useCallback(() => {
    const today = new Date();
    const todayFormatted = formatDateLocal(today);
    
    // If date changed, finalize previous day
    if (currentDateRef.current && currentDateRef.current !== todayFormatted) {
      finalizeDate(currentDateRef.current);
    }
    
    currentDateRef.current = todayFormatted;
    
    // Load draft for today
    const draft = getDraft(todayFormatted);
    if (draft) {
      setPhysicalHealth(draft.physical ?? null);
      setMentalHealth(draft.mental ?? null);
      setEntry(draft.text ?? '');
    } else {
      setPhysicalHealth(null);
      setMentalHealth(null);
      setEntry('');
    }
    
    return todayFormatted;
  }, []);

  // Auto-save text with debounce
  const debouncedSaveText = useCallback((text: string) => {
    if (textDebounceRef.current) {
      clearTimeout(textDebounceRef.current);
    }
    
    textDebounceRef.current = setTimeout(() => {
      const draftData = {
        date: currentDateRef.current,
        text,
        physical: physicalHealth,
        mental: mentalHealth,
      };
      
      // Check if current state has content
      if (hasContent({ physical: physicalHealth, mental: mentalHealth, text })) {
        saveDraft(draftData);
      } else {
        // Clear empty draft instead of saving
        clearDraft(currentDateRef.current);
      }
    }, 500); // 500ms debounce
  }, [physicalHealth, mentalHealth]);

  // Auto-save ratings immediately
  const saveRating = useCallback((type: 'physical' | 'mental', value: number | null) => {
    const newPhysical = type === 'physical' ? value : physicalHealth;
    const newMental = type === 'mental' ? value : mentalHealth;
    
    const draftData = {
      date: currentDateRef.current,
      physical: newPhysical,
      mental: newMental,
      text: entry,
    };
    
    // Check if current state has content
    if (hasContent({ physical: newPhysical, mental: newMental, text: entry })) {
      saveDraft(draftData);
    } else {
      // Clear empty draft instead of saving
      clearDraft(currentDateRef.current);
    }
  }, [physicalHealth, mentalHealth, entry]);

  // Handle midnight rollover
  const scheduleMidnightRollover = useCallback(() => {
    if (midnightTimerRef.current) {
      clearTimeout(midnightTimerRef.current);
    }
    
    const timeUntilMidnight = getNextMidnightTimestamp() - Date.now();
    
    midnightTimerRef.current = setTimeout(() => {
      const today = new Date();
      const todayFormatted = formatDateLocal(today);
      
      // Finalize current day
      finalizeDate(currentDateRef.current);
      
      // Reset state for new day
      currentDateRef.current = todayFormatted;
      setPhysicalHealth(null);
      setMentalHealth(null);
      setEntry('');
      
      // Schedule next midnight
      scheduleMidnightRollover();
    }, timeUntilMidnight);
  }, []);

  // Handle app state changes
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      const today = new Date();
      const todayFormatted = formatDateLocal(today);
      
      // Check if date changed while app was in background
      if (lastOpenDateRef.current && lastOpenDateRef.current !== todayFormatted) {
        // Finalize previous date (only saves if there was content)
        finalizeDate(lastOpenDateRef.current);
        // Reset state to empty for new day
        setPhysicalHealth(null);
        setMentalHealth(null);
        setEntry('');
        // Initialize new day
        initializeToday();
      }
      
      lastOpenDateRef.current = todayFormatted;
    }
  }, [initializeToday]);

  // Initialize on mount
  useEffect(() => {
    const todayFormatted = initializeToday();
    lastOpenDateRef.current = todayFormatted;
    
    // Schedule midnight rollover
    scheduleMidnightRollover();
    
    // Listen to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
      if (textDebounceRef.current) {
        clearTimeout(textDebounceRef.current);
      }
      if (midnightTimerRef.current) {
        clearTimeout(midnightTimerRef.current);
      }
    };
  }, [initializeToday, scheduleMidnightRollover, handleAppStateChange]);

  // Handle text changes
  const handleTextChange = useCallback((text: string) => {
    setEntry(text);
    debouncedSaveText(text);
  }, [debouncedSaveText]);

  // Handle physical health rating changes
  const handlePhysicalHealthChange = useCallback((rating: number) => {
    setPhysicalHealth(rating);
    saveRating('physical', rating);
  }, [saveRating]);

  // Handle mental health rating changes
  const handleMentalHealthChange = useCallback((rating: number) => {
    setMentalHealth(rating);
    saveRating('mental', rating);
  }, [saveRating]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable onLongPress={__DEV__ ? finalizeTodayNow : undefined}>
              <Text style={styles.dateText}>{formatDateForDisplay(new Date()).toUpperCase()}</Text>
            </Pressable>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.label}>PHYSICAL HEALTH</Text>
            <RatingSelector
              value={physicalHealth}
              onChange={handlePhysicalHealthChange}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>MENTAL HEALTH</Text>
            <RatingSelector
              value={mentalHealth}
              onChange={handleMentalHealthChange}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>ENTRY</Text>
            <TextInput
              style={styles.entryBox}
              value={entry}
              onChangeText={handleTextChange}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: SIZES.pageBottomPad,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  dateText: {
    color: COLORS.foreground,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Alegreya-Bold',
  },
  section: { 
    marginTop: SIZES.sectionGap 
  },
  label: {
    color: COLORS.foreground,
    fontFamily: 'Alegreya-Bold',
    letterSpacing: 1,
    marginBottom: 12,   // was 6–8 → more space between label and circles/box
  },
  entryBox: {
    height: SIZES.entryBoxHeight,   // use the shared height
    borderWidth: 1,
    borderColor: COLORS.foreground,
    borderRadius: 12,
    backgroundColor: 'transparent',
    color: COLORS.foreground,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    fontFamily: 'Alegreya-Regular',   // <-- new line
    fontSize: 16,                     // optional: keep consistent with rest
  },
});

export default JournalScreen;