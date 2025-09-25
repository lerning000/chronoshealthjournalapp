/**
 * Past Entries Screen
 * Displays a single selected journal entry with date selection
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import RatingSelector from './RatingSelector';
import { COLORS } from './src/theme/colors';

function PastEntriesScreen() {
  const [selectedEntry] = useState(null);
  const [selectedDate, setSelectedDate] = useState<{
    year: number | null;
    month: number | null;
    day: number | null;
  }>({
    year: null,
    month: null,
    day: null,
  });

  // Check if we have a valid date selected
  const hasValidDate = selectedDate.year !== null && selectedDate.month !== null && selectedDate.day !== null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <View style={styles.content}>
        {/* Date Selectors */}
        <View style={styles.dateSelectors}>
          <Text style={styles.dateLabel}>YEAR</Text>
          <Text style={styles.dateLabel}>MONTH</Text>
          <Text style={styles.dateLabel}>DAY</Text>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {!hasValidDate ? (
            <View style={styles.noDateSelected}>
              <Text style={styles.noDateText}>Select a date to view an entry</Text>
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.label}>PHYSICAL HEALTH</Text>
                <RatingSelector
                  rating={selectedEntry ? selectedEntry.physical : null}
                  onRatingChange={() => {}} // Read-only for past entries
                  readOnly={true}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>MENTAL HEALTH</Text>
                <RatingSelector
                  rating={selectedEntry ? selectedEntry.mental : null}
                  onRatingChange={() => {}} // Read-only for past entries
                  readOnly={true}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>ENTRY</Text>
                <View style={styles.entryTextBox}>
                  <Text style={styles.entryText}>
                    {selectedEntry ? selectedEntry.text : ''}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  dateSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  dateLabel: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
    fontFamily: 'Alegreya-Bold',
  },
  mainContent: {
    flex: 1,
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
    textAlign: 'left',
    fontFamily: 'Alegreya-Bold',
  },
  entryTextBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    height: 250,
    padding: 10,
    width: '100%',
  },
  entryText: {
    color: COLORS.foreground,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Alegreya-Regular',
  },
  noDateSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDateText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'Alegreya-Regular',
    textAlign: 'center',
  },
});

export default PastEntriesScreen;