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

function PastEntriesScreen() {
  const [selectedEntry] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Date Selectors */}
        <View style={styles.dateSelectors}>
          <Text style={styles.dateLabel}>YEAR</Text>
          <Text style={styles.dateLabel}>MONTH</Text>
          <Text style={styles.dateLabel}>DAY</Text>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <View style={styles.section}>
            <Text style={styles.label}>PHYSICAL HEALTH</Text>
            <RatingSelector
              rating={selectedEntry ? selectedEntry.physical : 0}
              onRatingChange={() => {}} // Read-only for past entries
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>MENTAL HEALTH</Text>
            <RatingSelector
              rating={selectedEntry ? selectedEntry.mental : 0}
              onRatingChange={() => {}} // Read-only for past entries
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  mainContent: {
    flex: 1,
  },
  section: {
    marginBottom: 50,
    alignItems: 'flex-start',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
    letterSpacing: 1.2,
    textAlign: 'left',
  },
  entryTextBox: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    height: 250,
    padding: 10,
    width: '100%',
  },
  entryText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default PastEntriesScreen;