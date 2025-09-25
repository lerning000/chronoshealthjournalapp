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
} from 'react-native';
import RatingSelector from './RatingSelector';
import { getDraft, saveDraft, finalizeDate, Draft } from './src/storage/entries';
import { COLORS } from './src/theme/colors';

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
      saveDraft({
        date: currentDateRef.current,
        text,
      });
    }, 500); // 500ms debounce
  }, []);

  // Auto-save ratings immediately
  const saveRating = useCallback((type: 'physical' | 'mental', value: number | null) => {
    saveDraft({
      date: currentDateRef.current,
      [type]: value,
    });
  }, []);

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
        finalizeDate(lastOpenDateRef.current);
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
            <Text style={styles.dateText}>
              {formatDateForDisplay(new Date()).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.label}>PHYSICAL HEALTH</Text>
            <RatingSelector
              rating={physicalHealth ?? -1}
              onRatingChange={handlePhysicalHealthChange}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>MENTAL HEALTH</Text>
            <RatingSelector
              rating={mentalHealth ?? -1}
              onRatingChange={handleMentalHealthChange}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>ENTRY</Text>
            <TextInput
              style={styles.textInput}
              value={entry}
              onChangeText={handleTextChange}
              placeholder="Write your thoughts, experiences, or anything else you'd like to record..."
              placeholderTextColor={COLORS.foreground}
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
    paddingBottom: 40,
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
    marginBottom: 50,
    alignItems: 'flex-start',
  },
  label: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
    letterSpacing: 1.2,
    fontFamily: 'Alegreya-Bold',
    textAlign: 'left',
  },
  textInput: {
    backgroundColor: 'transparent',
    color: COLORS.foreground,
    fontSize: 16,
    height: 250,
    fontFamily: 'Alegreya-Regular',
    width: '100%',
    lineHeight: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 10,
  },
});

export default JournalScreen;