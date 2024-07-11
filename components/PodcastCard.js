import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PodcastCard = ({ podcast, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Image source={{ uri: podcast.imageUrl }} style={styles.image} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{podcast.title}</Text>
      <Text style={styles.author}>{podcast.author}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
});

export default PodcastCard;
