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
            <Text style={styles.dateText}>{getCurrentDate().toUpperCase()}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.label}>PHYSICAL HEALTH</Text>
            <RatingSelector
              rating={physicalHealth}
              onRatingChange={setPhysicalHealth}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>MENTAL HEALTH</Text>
            <RatingSelector
              rating={mentalHealth}
              onRatingChange={setMentalHealth}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>JOURNAL ENTRY</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Alegreya',
  },
  section: {
    marginBottom: 48,
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
    letterSpacing: 1.2,
    fontFamily: 'Alegreya',
    textAlign: 'center',
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
    width: '100%',
  },
  largeTextInput: {
    minHeight: 140,
    lineHeight: 24,
  },
});

export default App;