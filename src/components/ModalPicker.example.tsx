// Example usage of ModalPicker component
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalPicker from './ModalPicker';
import { COLORS } from '../theme/colors';

// Example: Year picker
const ExampleModalPickerUsage = () => {
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // Sample data: years from 2024 down to 2020 (newest first)
  const years = [2024, 2023, 2022, 2021, 2020];

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    console.log('Selected year:', year);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SELECTED YEAR</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setYearPickerVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedYear ? selectedYear.toString() : 'Select Year'}
        </Text>
      </TouchableOpacity>

      <ModalPicker
        visible={yearPickerVisible}
        title="Select Year"
        data={years}
        onSelect={handleYearSelect}
        onClose={() => setYearPickerVisible(false)}
        testID="year-picker"
      />
    </View>
  );
};

// Example: Month picker with custom formatting
const ExampleMonthPicker = () => {
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  
  // Sample data: months 1-12 (already sorted newest->oldest if needed)
  const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const formatMonth = (month: number): string => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1] || `Month ${month}`;
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    console.log('Selected month:', month);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SELECTED MONTH</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setMonthPickerVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedMonth ? formatMonth(selectedMonth) : 'Select Month'}
        </Text>
      </TouchableOpacity>

      <ModalPicker
        visible={monthPickerVisible}
        title="Select Month"
        data={months}
        formatItem={formatMonth}
        onSelect={handleMonthSelect}
        onClose={() => setMonthPickerVisible(false)}
        testID="month-picker"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  label: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Alegreya-Bold',
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.foreground,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Alegreya-Regular',
    textAlign: 'center',
  },
});

export { ExampleModalPickerUsage, ExampleMonthPicker };
