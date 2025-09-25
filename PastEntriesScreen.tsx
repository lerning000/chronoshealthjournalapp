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
  Pressable,
} from 'react-native';
import ModalPicker from './src/components/ModalPicker';
import RatingSelector from './RatingSelector';
import { Entry, getEntries, seedDummyEntries } from './src/storage/entries';
import { COLORS } from './src/theme/colors';

function PastEntriesScreen() {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  
  // Modal state
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [dayModalVisible, setDayModalVisible] = useState(false);

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

  type YMD = { y: number; m: number; d: number };
  const parseYMD = (dateStr: string): YMD => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return { y, m, d };
  };

  // Unique years (DESC)
  const yearsSortedDesc = useMemo(() => {
    const s = new Set<number>();
    entries.forEach(e => s.add(parseYMD(e.date).y));
    return Array.from(s).sort((a,b) => b - a);
  }, [entries]);

  // Unique months for selected year (DESC)
  const monthsForYearSortedDesc = useMemo(() => {
    if (year == null) return [];
    const s = new Set<number>();
    entries.forEach(e => {
      const { y, m } = parseYMD(e.date);
      if (y === year) s.add(m);
    });
    return Array.from(s).sort((a,b) => b - a);
  }, [entries, year]);

  // Unique days for selected year+month (DESC)
  const daysForYearMonthSortedDesc = useMemo(() => {
    if (year == null || month == null) return [];
    const s = new Set<number>();
    entries.forEach(e => {
      const { y, m, d } = parseYMD(e.date);
      if (y === year && m === month) s.add(d);
    });
    return Array.from(s).sort((a,b) => b - a);
  }, [entries, year, month]);

  const hasYear = year != null;
  const hasMonth = hasYear && month != null;
  const hasDay = hasMonth && day != null;
  const hasValidDate = year != null && month != null && day != null;

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
            <Pressable
              style={styles.pickerButton}
              onPress={() => setYearModalVisible(true)}
            >
              <Text style={styles.pickerButtonText}>
                {year == null ? 'Select' : year.toString()}
              </Text>
            </Pressable>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.dateLabel}>MONTH</Text>
            <Pressable
              style={[styles.pickerButton, !hasYear && styles.pickerButtonDisabled]}
              onPress={() => {
                if (!hasYear) return;
                setMonthModalVisible(true);
              }}
            >
              <Text style={[styles.pickerButtonText, !hasYear && styles.pickerButtonTextDisabled]}>
                {!hasYear ? 'Select' : month == null ? 'Select' : new Date(2000, month - 1, 1).toLocaleString(undefined, { month: 'long' })}
              </Text>
            </Pressable>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.dateLabel}>DAY</Text>
            <Pressable
              style={[styles.pickerButton, !hasMonth && styles.pickerButtonDisabled]}
              onPress={() => {
                if (!hasMonth) return;
                setDayModalVisible(true);
              }}
            >
              <Text style={[styles.pickerButtonText, !hasMonth && styles.pickerButtonTextDisabled]}>
                {!hasMonth ? 'Select' : day == null ? 'Select' : day.toString()}
              </Text>
            </Pressable>
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

      {/* Modal Pickers */}
      <ModalPicker
        visible={yearModalVisible}
        title="Select Year"
        data={yearsSortedDesc}
        formatItem={(y) => String(y)}
        onSelect={(selectedYear) => {
          setYear(selectedYear);
          setMonth(null);
          setDay(null);
        }}
        onClose={() => setYearModalVisible(false)}
        testID="year-picker"
      />

      <ModalPicker
        visible={monthModalVisible}
        title="Select Month"
        data={monthsForYearSortedDesc}
        formatItem={(m) => new Date(2000, m - 1, 1).toLocaleString(undefined, { month: 'long' })}
        onSelect={(selectedMonth) => {
          setMonth(selectedMonth);
          setDay(null);
        }}
        onClose={() => setMonthModalVisible(false)}
        testID="month-picker"
      />

      <ModalPicker
        visible={dayModalVisible}
        title="Select Day"
        data={daysForYearMonthSortedDesc}
        formatItem={(d) => String(d)}
        onSelect={(selectedDay) => {
          setDay(selectedDay);
        }}
        onClose={() => setDayModalVisible(false)}
        testID="day-picker"
      />
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
  pickerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.foreground,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  pickerButtonText: {
    color: COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Alegreya-Regular',
    textAlign: 'center',
  },
  pickerButtonTextDisabled: {
    color: COLORS.foreground,
    opacity: 0.5,
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