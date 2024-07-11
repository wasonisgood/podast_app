import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, PanResponder, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MiniPlayer = ({ podcastTitle, episodeTitle, coverImage, isPlaying, onPlayPause, onClose, onOpen }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          // Upward swipe detected, open full player
          onOpen();
        } else {
          // Reset position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
      <Image source={{ uri: coverImage }} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.podcastTitle} numberOfLines={1}>{podcastTitle}</Text>
          <Text style={styles.episodeTitle} numberOfLines={1}>{episodeTitle}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={onPlayPause} style={styles.playPauseButton}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={28} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#999999" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 80,
  },
  coverImage: {
    width: 56,
    height: 56,
    borderRadius: 4,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  podcastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  episodeTitle: {
    fontSize: 12,
    color: '#BBBBBB',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playPauseButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
  },
});

export default MiniPlayer;
