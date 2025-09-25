/**
 * RatingSelector Component
 * Displays 10 circles for rating selection (0-10)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { COLORS } from './src/theme/colors';

interface RatingSelectorProps {
  rating: number | null; // null for unset, -1 for unset, 0-10 for actual ratings
  onRatingChange: (rating: number) => void;
  readOnly?: boolean; // when true, blocks taps and shows static rating
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ rating, onRatingChange, readOnly = false }) => {
  const renderCircle = (index: number) => {
    // Show filled circles only if rating is set (>= 0) and this index is <= rating
    // Handle both null and -1 as "unset"
    const numericRating = rating === null ? -1 : rating;
    const isFilled = numericRating >= 0 && index <= numericRating;
    
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
        onPress={() => onRatingChange(index)}
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
        {Array.from({ length: 11 }, (_, index) => renderCircle(index))}
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
    borderColor: COLORS.border,
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
    borderColor: '#666666',
  },
});

export default RatingSelector;
