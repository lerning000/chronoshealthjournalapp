/**
 * RatingSelector Component
 * Displays 10 circles for rating selection (0-10)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { COLORS } from './src/theme/colors';

interface RatingSelectorProps {
  value: number | null;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  color?: string;
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ value, onChange, readOnly = false, color }) => {
  const renderCircle = (index: number) => {
    // Show filled circles only if value is set (1-10) and this index is <= value
    // When value is null, show all circles unfilled
    const isFilled = value !== null && index <= value;
    
    const circleElement = (
      <View
        key={index}
        style={[
          styles.circle,
          isFilled ? styles.filledCircle : styles.outlinedCircle
        ]}
      />
    );
    
    if (readOnly) {
      return circleElement;
    }
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.circle,
          isFilled ? styles.filledCircle : styles.outlinedCircle
        ]}
        onPress={() => onChange?.(index)}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={`Rate ${index} out of 10`}
        accessibilityHint={`Tap to set rating to ${index}`}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        {Array.from({ length: 10 }, (_, index) => renderCircle(index + 1))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCircle: {
    backgroundColor: COLORS.foreground,
    borderWidth: 2,
    borderColor: COLORS.foreground,
    shadowColor: COLORS.foreground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  outlinedCircle: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.foreground,
  },
});

export default RatingSelector;
