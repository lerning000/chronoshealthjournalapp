/**
 * RatingSelector Component
 * Displays 10 circles for rating selection (0-10)
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface RatingSelectorProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ rating, onRatingChange }) => {
  const renderCircle = (index: number) => {
    const isFilled = index <= rating;
    
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
      <Text style={styles.ratingText}>
        {rating === 0 ? 'Not rated' : `${rating}/10`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
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
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
    fontFamily: 'Alegreya',
  },
});

export default RatingSelector;
