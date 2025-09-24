/**
 * Past Entries Screen
 * Displays past journal entries with search functionality
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import RatingSelector from './RatingSelector';

function PastEntriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data for example entries
  const exampleEntries = [
    {
      id: 1,
      date: 'AUGUST 1, 2025',
      physicalHealth: 5,
      mentalHealth: 7,
      entry: 'Had a great workout this morning. Feeling energized and motivated for the day ahead. The weather was perfect for a run.',
    },
    {
      id: 2,
      date: 'JULY 31, 2025',
      physicalHealth: 3,
      mentalHealth: 4,
      entry: 'Feeling a bit under the weather today. Took it easy and focused on self-care. Sometimes rest is the best medicine.',
    },
  ];

  const renderEntry = (entry: any) => (
    <View key={entry.id} style={styles.entryContainer}>
      <Text style={styles.dateText}>{entry.date}</Text>
      
      <View style={styles.ratingSection}>
        <Text style={styles.sectionLabel}>PHYSICAL HEALTH</Text>
        <RatingSelector
          rating={entry.physicalHealth}
          onRatingChange={() => {}} // Read-only for past entries
        />
      </View>

      <View style={styles.ratingSection}>
        <Text style={styles.sectionLabel}>MENTAL HEALTH</Text>
        <RatingSelector
          rating={entry.mentalHealth}
          onRatingChange={() => {}} // Read-only for past entries
        />
      </View>

      <View style={styles.entrySection}>
        <Text style={styles.sectionLabel}>ENTRY</Text>
        <Text style={styles.entryText}>{entry.entry}</Text>
      </View>

      <View style={styles.separator} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.searchBar}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="SEARCH MONTH, DAY..."
          placeholderTextColor="#888888"
        />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {exampleEntries.map(renderEntry)}
        </ScrollView>
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
    paddingTop: 20,
  },
  searchBar: {
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    fontFamily: 'Alegreya-Regular',
  },
  scrollView: {
    flex: 1,
  },
  entryContainer: {
    marginBottom: 24,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 0.5,
    fontFamily: 'Alegreya-Regular',
  },
  ratingSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1.2,
    fontFamily: 'Alegreya-Regular',
  },
  entrySection: {
    marginBottom: 20,
  },
  entryText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Alegreya-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginTop: 8,
  },
});

export default PastEntriesScreen;