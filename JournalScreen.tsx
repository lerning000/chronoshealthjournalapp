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

function JournalScreen() {
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
            <Text style={styles.label}>ENTRY</Text>
            <TextInput
              style={styles.textInput}
              value={entry}
              onChangeText={setEntry}
              placeholder="Write your thoughts, experiences, or anything else you'd like to record..."
              placeholderTextColor="#FFFFFF"
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
    paddingHorizontal: 20,
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
    fontFamily: 'Alegreya-Regular',
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
    fontFamily: 'Alegreya-Regular',
    textAlign: 'left',
  },
  textInput: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 120,
    fontFamily: 'Alegreya-Regular',
    width: '100%',
    lineHeight: 24,
  },
});

export default JournalScreen;