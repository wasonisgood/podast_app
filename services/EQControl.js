import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EQ_PRESETS = [
  { name: '平坦', icon: 'reorder-four' },
  { name: '低音增強', icon: 'bass' },
  { name: '高音增強', icon: 'options' },
  { name: '人聲增強', icon: 'mic' },
];

const EQControl = ({ currentPreset, onPresetChange, style }) => {
  const currentPresetName = EQ_PRESETS[currentPreset].name;
  const currentPresetIcon = EQ_PRESETS[currentPreset].icon;

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => onPresetChange((currentPreset + 1) % EQ_PRESETS.length)}
    >
      <Ionicons name={currentPresetIcon} size={24} color="#fff" />
      <Text style={styles.text}>{currentPresetName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  text: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EQControl;