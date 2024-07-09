import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import styles from './styles';

const { width } = Dimensions.get('window');

const PlayerScreen = ({ navigation, route }) => {
  const { podcast } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  const lyrics = [
    "這是第一行歌詞",
    "這是第二行歌詞",
    "這是第三行歌詞",
    "這是第四行歌詞",
    "這是第五行歌詞",
  ];

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playPauseSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: podcast.audioUrl },  // 使用传入的音频 URL
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
    }
  };

  const seekAudio = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  };

  const renderLyric = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp'
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp'
    });
    return (
      <Animated.View style={[styles.lyricContainer, { width, opacity, transform: [{ scale }] }]}>
        <Text style={styles.lyricText}>{item}</Text>
      </Animated.View>
    );
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.playerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <Image source={podcast.image} style={styles.playerImage} />
      <Text style={styles.playerTitle}>{podcast.title}</Text>
      <Text style={styles.playerAuthor}>{podcast.author}</Text>
      
      <Animated.FlatList
        data={lyrics}
        renderItem={renderLyric}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seekAudio}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={playPauseSound}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.aiButton}>
        <Ionicons name="bulb-outline" size={24} color="white" />
        <Text style={styles.aiButtonText}>AI 功能</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default PlayerScreen;
