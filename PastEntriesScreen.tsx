/**
 * Past Entries Screen
 * Displays a single selected journal entry with date selection
 *
 * @format
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RatingSelector from './RatingSelector';
import { Entry, getEntries, seedDummyEntries } from './src/storage/entries';
import { COLORS } from './src/theme/colors';

function PastEntriesScreen() {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  // Seed dummy entries and load entries on mount
  useEffect(() => {
    seedDummyEntries();
    setEntries(getEntries());
  }, []);

  // Reset month and day when year changes
  useEffect(() => {
    if (year !== null) {
      setMonth(null);
      setDay(null);
    }
  }, [year]);

  // Reset day when month changes
  useEffect(() => {
    if (month !== null) {
      setDay(null);
    }
  }, [month]);

  // Helper functions to get unique values from entries
  const getUniqueYears = (): number[] => {
    const years = entries.map(entry => parseInt(entry.date.split('-')[0]));
    return [...new Set(years)].sort((a, b) => b - a); // Sort descending
  };

  const getUniqueMonths = (selectedYear: number): number[] => {
    const months = entries
      .filter(entry => parseInt(entry.date.split('-')[0]) === selectedYear)
      .map(entry => parseInt(entry.date.split('-')[1]));
    return [...new Set(months)].sort((a, b) => a - b); // Sort ascending
  };

  const getUniqueDays = (selectedYear: number, selectedMonth: number): number[] => {
    const days = entries
      .filter(entry => {
        const [entryYear, entryMonth] = entry.date.split('-').map(Number);
        return entryYear === selectedYear && entryMonth === selectedMonth;
      })
      .map(entry => parseInt(entry.date.split('-')[2]));
    return [...new Set(days)].sort((a, b) => a - b); // Sort ascending
  };

  // Helper: parse "YYYY-MM-DD"
  const parseYMD = (dateStr: string): { y: number; m: number; d: number } => {
    const [ys, ms, ds] = dateStr.split('-');
    return { y: Number(ys), m: Number(ms), d: Number(ds) };
  };

  const hasYear = year != null;
  const hasMonth = hasYear && month != null;
  const hasDay = hasMonth && day != null;
  const hasValidDate = hasDay;

  const selectedEntry: Entry | null = useMemo(() => {
    if (!hasValidDate) return null;
    return (
      entries.find((e) => {
        const { y, m, d } = parseYMD(e.date);
        return y === year && m === month && d === day;
      }) ?? null
    );
  }, [entries, year, month, day, hasValidDate]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <View style={styles.content}>
        {/* Date Selectors */}
        <View style={styles.dateSelectors}>
          <View style={styles.pickerContainer}>
            <Text style={styles.dateLabel}>YEAR</Text>
            <Picker
              selectedValue={year}
              onValueChange={(value) => setYear(value)}
              style={styles.picker}
              itemStyle={{ color: COLORS.foreground }}
              dropdownIconColor={COLORS.foreground}
            >
              <Picker.Item label="Select Year" value={null} />
              {getUniqueYears().map(yearOption => (
                <Picker.Item key={yearOption} label={yearOption.toString()} value={yearOption} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.dateLabel}>MONTH</Text>
            <Picker
              selectedValue={month}
              onValueChange={(value) => setMonth(value)}
              style={styles.picker}
              itemStyle={{ color: COLORS.foreground }}
              dropdownIconColor={COLORS.foreground}
              enabled={hasYear}
            >
              <Picker.Item label="Select Month" value={null} />
              {year !== null && getUniqueMonths(year).map(monthOption => (
                <Picker.Item key={monthOption} label={monthOption.toString()} value={monthOption} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.dateLabel}>DAY</Text>
            <Picker
              selectedValue={day}
              onValueChange={(value) => setDay(value)}
              style={styles.picker}
              itemStyle={{ color: COLORS.foreground }}
              dropdownIconColor={COLORS.foreground}
              enabled={hasMonth}
            >
              <Picker.Item label="Select Day" value={null} />
              {year !== null && month !== null && getUniqueDays(year, month).map(dayOption => (
                <Picker.Item key={dayOption} label={dayOption.toString()} value={dayOption} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {!hasValidDate ? (
            <View style={styles.noDateSelected}>
              <Text style={styles.noDateText}>Select Year → Month → Day to view an entry.</Text>
            </View>
          ) : selectedEntry ? (
            <>
              <View style={styles.section}>
                <Text style={styles.label}>PHYSICAL HEALTH</Text>
                <RatingSelector
                  value={selectedEntry.physical ?? null}
                  readOnly
                  color={COLORS.foreground}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>MENTAL HEALTH</Text>
                <RatingSelector
                  value={selectedEntry.mental ?? null}
                  readOnly
                  color={COLORS.foreground}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>ENTRY</Text>
                <View style={styles.entryTextBox}>
                  <Text style={styles.entryText}>
                    {selectedEntry.text}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.noDateSelected}>
              <Text style={styles.noDateText}>No entry for this date.</Text>
            </View>
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
    marginBottom: 8,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  picker: {
    color: COLORS.foreground,
    backgroundColor: 'transparent',
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
    borderWidth: 0,
    borderColor: 'transparent',
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
    color: COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Alegreya-Regular',
    textAlign: 'center',
  },
});

export default PastEntriesScreen;