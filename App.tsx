/**
 * Health Journal App
 * Main journal entry screen
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import RatingSelector from './RatingSelector';

function App() {
  const [physicalHealth, setPhysicalHealth] = useState(0);
  const [mentalHealth, setMentalHealth] = useState(0);
  const [entry, setEntry] = useState('');

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Physical Health</Text>
              <Text style={styles.sectionDescription}>Rate your physical wellbeing</Text>
            </View>
            <RatingSelector
              rating={physicalHealth}
              onRatingChange={setPhysicalHealth}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Mental Health</Text>
              <Text style={styles.sectionDescription}>Rate your mental wellbeing</Text>
            </View>
            <RatingSelector
              rating={mentalHealth}
              onRatingChange={setMentalHealth}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Journal Entry</Text>
              <Text style={styles.sectionDescription}>Share your thoughts and experiences</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.largeTextInput]}
              value={entry}
              onChangeText={setEntry}
              placeholder="Write your thoughts, experiences, or anything else you'd like to record..."
              placeholderTextColor="#888"
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
    backgroundColor: '#0A0A0A',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: 'Alegreya',
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'Alegreya',
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
    fontFamily: 'Alegreya',
  },
  sectionDescription: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: 'Alegreya',
  },
  textInput: {
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#333333',
    fontFamily: 'Alegreya',
  },
  largeTextInput: {
    minHeight: 140,
    lineHeight: 24,
  },
});

export default App;