import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { COLORS } from '../theme/colors';

type ModalPickerProps<T extends string | number> = {
  visible: boolean;
  title: string;
  data: T[];                 // already sorted newest->oldest
  formatItem?: (v: T) => string;
  onSelect: (v: T) => void;
  onClose: () => void;
  testID?: string;
};

const ModalPicker = <T extends string | number>({
  visible,
  title,
  data,
  formatItem = (value: T) => String(value),
  onSelect,
  onClose,
  testID,
}: ModalPickerProps<T>) => {
  const handleItemPress = (item: T) => {
    onSelect(item);
    onClose();
  };

  const renderItem = ({ item }: { item: T }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Select ${formatItem(item)}`}
      accessibilityHint={`Tap to select ${formatItem(item)}`}
      testID={`${testID}-item-${item}`}
    >
      <Text style={styles.itemText}>{formatItem(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              testID={`${testID}-close`}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => String(item)}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            testID={`${testID}-list`}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    maxWidth: 320,
    width: '100%',
    maxHeight: '80%',
    shadowColor: COLORS.foreground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.foreground,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Alegreya-Bold',
    letterSpacing: 0.5,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  closeButtonText: {
    color: COLORS.foreground,
    fontSize: 18,
    fontWeight: '600',
  },
  list: {
    maxHeight: 300,
  },
  item: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  itemText: {
    color: COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Alegreya-Regular',
    textAlign: 'left',
  },
});

export default ModalPicker;
