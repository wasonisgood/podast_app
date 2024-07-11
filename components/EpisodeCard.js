// components/EpisodeCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EpisodeCard = ({ episode, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.content}>
      <Text style={styles.title}>{episode.title}</Text>
      <Text style={styles.duration}>{episode.duration}</Text>
    </View>
    <Text style={styles.date}>{episode.publishDate}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default EpisodeCard;