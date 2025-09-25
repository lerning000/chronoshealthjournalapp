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
  TextInput,
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

  // Auto-size Month button to longest visible month for selected year
  const monthLongestLabel = useMemo(() => {
    return monthsForYearSortedDesc
      .map(m => new Date(2000, m - 1, 1).toLocaleString(undefined, { month: 'long' }))
      .reduce((a,b) => (b.length > a.length ? b : a), '');
  }, [monthsForYearSortedDesc]);

  // heuristic width based on label length (approx 8px per char + paddings), clamped:
  const monthBtnWidth = Math.min(180, Math.max(120, monthLongestLabel.length * 8 + 32));

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
        <View style={styles.headerWrap}>
          <View style={styles.row}>
          <View style={styles.selectorCol}>
            <Text style={styles.selectorLabel}>YEAR</Text>
            <Pressable
              style={styles.selectorBtn}
              onPress={() => setYearModalVisible(true)}
              testID="year-btn"
            >
              <Text
                style={styles.selectorText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}   // allow minor shrink for long names
                allowFontScaling={false}
              >
                {year == null ? 'Select' : year.toString()}
              </Text>
            </Pressable>
          </View>

          <View style={styles.selectorCol}>
            <Text style={styles.selectorLabel}>MONTH</Text>
            <Pressable
              style={[styles.selectorBtn, { maxWidth: monthBtnWidth }]}
              onPress={() => {
                if (!hasYear) return;
                setMonthModalVisible(true);
              }}
              disabled={!hasYear}
              testID="month-btn"
            >
              <Text
                style={styles.selectorText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}   // allow minor shrink for long names
                allowFontScaling={false}
              >
                {!hasYear ? 'Select' : month == null ? 'Select' : new Date(2000, month - 1, 1).toLocaleString(undefined, { month: 'long' })}
              </Text>
            </Pressable>
          </View>

          <View style={styles.selectorCol}>
            <Text style={styles.selectorLabel}>DAY</Text>
            <Pressable
              style={styles.selectorBtn}
              onPress={() => {
                if (!hasMonth) return;
                setDayModalVisible(true);
              }}
              disabled={!hasMonth}
              testID="day-btn"
            >
              <Text
                style={styles.selectorText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}   // allow minor shrink for long names
                allowFontScaling={false}
              >
                {!hasMonth ? 'Select' : day == null ? 'Select' : day.toString()}
              </Text>
            </Pressable>
          </View>
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
                <Text style={styles.entryLabel}>ENTRY</Text>
                <TextInput
                  value={selectedEntry?.text ?? ''}   // show box even if empty
                  editable={false}
                  multiline
                  style={styles.entryReadonlyBox}
                />
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
  headerWrap: {
    width: '100%',
    maxWidth: 420,       // was 360: give the row more room
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    columnGap: 12,
    marginTop: 8,
  },
  selectorCol: {
    flex: 1,
    alignItems: 'center',
  },
  selectorLabel: {
    fontFamily: 'Alegreya-Bold',
    color: COLORS.foreground,
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  selectorBtn: {
    width: '85%',        // was 80%
    maxWidth: 160,       // was 120/140: allow wider labels like "September"
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.foreground,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    color: COLORS.foreground,
    fontFamily: 'Alegreya-Regular',
    textAlign: 'center',
    includeFontPadding: false, // avoids vertical off-center on Android
    fontSize: 16,
    lineHeight: 18,            // closer vertical centering within 44px height
  },
  mainContent: {
    flex: 1,
  },
  section: {
    marginBottom: 50,
    alignItems: 'flex-start',
  },
  label: {
    fontFamily: 'Alegreya-Bold',
    color: COLORS.foreground,
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  entryLabel: {
    marginTop: 16,
    marginBottom: 6,
    color: COLORS.foreground,
    fontFamily: 'Alegreya-Bold',
    letterSpacing: 1,
    textAlign: 'left',
  },
  entryReadonlyBox: {
    alignSelf: 'stretch',         // fill available width
    width: '100%',                // prevents odd shrink on some layouts
    minHeight: 160,               // fixed height so empty box has proper shape
    borderWidth: 1,
    borderColor: COLORS.foreground,
    borderRadius: 12,
    backgroundColor: 'transparent',
    color: COLORS.foreground,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
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