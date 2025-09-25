/**
 * Past Entries Screen
 * Displays a single selected journal entry with date selection
 *
 * @format
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import ModalPicker from './src/components/ModalPicker';
import RatingSelector from './RatingSelector';
import { Entry, getEntries, seedDummyEntries } from './src/storage/entries';
import { COLORS } from './src/theme/colors';
import { SIZES } from './src/theme/sizes';

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
    if (__DEV__) {
      seedDummyEntries();
    }
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
  const parseYMD = useCallback((dateStr: string): YMD => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return { y, m, d };
  }, []);

  // Unique years (DESC)
  const yearsSortedDesc = useMemo(() => {
    const s = new Set<number>();
    entries.forEach(e => s.add(parseYMD(e.date).y));
    return Array.from(s).sort((a,b) => b - a);
  }, [entries, parseYMD]);

  // Unique months for selected year (DESC)
  const monthsForYearSortedDesc = useMemo(() => {
    if (year == null) return [];
    const s = new Set<number>();
    entries.forEach(e => {
      const { y, m } = parseYMD(e.date);
      if (y === year) s.add(m);
    });
    return Array.from(s).sort((a,b) => b - a);
  }, [entries, year, parseYMD]);

  // Unique days for selected year+month (DESC)
  const daysForYearMonthSortedDesc = useMemo(() => {
    if (year == null || month == null) return [];
    const s = new Set<number>();
    entries.forEach(e => {
      const { y, m, d } = parseYMD(e.date);
      if (y === year && m === month) s.add(d);
    });
    return Array.from(s).sort((a,b) => b - a);
  }, [entries, year, month, parseYMD]);

  const hasYear = year != null;
  const hasMonth = hasYear && month != null;
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
  }, [entries, year, month, day, hasValidDate, parseYMD]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ paddingBottom: SIZES.pageBottomPad }}
        keyboardShouldPersistTaps="handled"
      >
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
        <View style={styles.contentWrap}>
          {!hasValidDate ? (
            <View style={styles.noDateSelected}>
              <Text style={styles.noDateText}>Select Year → Month → Day to view an entry.</Text>
            </View>
          ) : selectedEntry ? (
            <>
              <View style={styles.section}>
                <Text style={styles.ratingLabel}>PHYSICAL HEALTH</Text>
                <RatingSelector
                  value={selectedEntry.physical ?? null}
                  readOnly
                  color={COLORS.foreground}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.ratingLabel}>MENTAL HEALTH</Text>
                <RatingSelector
                  value={selectedEntry.mental ?? null}
                  readOnly
                  color={COLORS.foreground}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.ratingLabel}>ENTRY</Text>
                <TextInput
                  value={selectedEntry?.text ?? ''}
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
      </ScrollView>

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
  headerWrap: {
    width: '100%',
    maxWidth: SIZES.headerMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    columnGap: SIZES.headerGap,
    marginTop: 8,
  },
  contentWrap: {
    width: '100%',
    maxWidth: SIZES.headerMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: 16,
    marginTop: SIZES.sectionGap,  // breathing room below selectors
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
  section: { 
    marginTop: SIZES.sectionGap 
  },
  ratingLabel: {
    color: COLORS.foreground,
    fontFamily: 'Alegreya-Bold',
    letterSpacing: 1,
    marginBottom: 12,   // was 6–8 → more space between label and circles/box
  },
  label: {
    fontFamily: 'Alegreya-Bold',
    color: COLORS.foreground,
    letterSpacing: 1,
    marginBottom: 12,   // was 6–8 → more space between label and circles/box
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
    height: SIZES.entryBoxHeight,
    borderWidth: 1,
    borderColor: COLORS.foreground,
    borderRadius: 12,
    backgroundColor: 'transparent',
    color: COLORS.foreground,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    fontFamily: 'Alegreya-Regular',   // <-- new line
    fontSize: 16,
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