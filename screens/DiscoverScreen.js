import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { fetchContent } from '../services/contentService';
import EQControl from '../services/EQControl';
import { applyEQToYouTube } from '../services/audioUtils';

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = height / 3;

const DiscoverScreen = ({ navigation }) => {
  const [content, setContent] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [currentEQPreset, setCurrentEQPreset] = useState(0);
  const [eqApplied, setEqApplied] = useState(false);
  const flatListRef = useRef();
  const audioRef = useRef(new Audio.Sound());
  const youtubePlayerRef = useRef(null);

  useEffect(() => {
    const loadContent = async () => {
      const contentData = await fetchContent();
      setContent(contentData);
    };

    loadContent();

    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, []);

  const applyEQPreset = async (presetIndex) => {
    const preset = EQControl.EQ_PRESETS[presetIndex].values;
    try {
      if (audioRef.current) {
        await audioRef.current.setEqualizer({
          bands: preset.map((value, index) => ({
            frequency: 60 * Math.pow(2, index),
            gain: value
          }))
        });
        setEqApplied(true);
      }
      if (youtubePlayerRef.current) {
        applyEQToYouTube(youtubePlayerRef.current, preset);
        setEqApplied(true);
      }
    } catch (error) {
      console.error('Error applying EQ:', error);
      setEqApplied(false);
    }
  };

  const playAudio = async (item) => {
    try {
      await audioRef.current.unloadAsync();
      if (item.type === 'podcast') {
        const { sound } = await Audio.Sound.createAsync(
          { uri: item.audioUrl },
          { shouldPlay: true }
        );
        audioRef.current = sound;
        await applyEQPreset(currentEQPreset);
        await sound.playAsync();
      } else if (item.type === 'youtube') {
        console.log('Playing YouTube audio:', item.videoId);
        // YouTube playback is handled by YoutubePlayer component
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const { item } = viewableItems[0];
      if (currentPlaying !== item.id) {
        setCurrentPlaying(item.id);
        playAudio(item);
      }
    }
  }, [currentPlaying]);

  const handleEQPresetChange = async (presetIndex) => {
    setCurrentEQPreset(presetIndex);
    await applyEQPreset(presetIndex);
  };

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        playAudio(item);
        navigation.navigate('AudioDetail', { audio: item });
      }}
    >
      <Image 
        source={{ uri: item.type === 'youtube' ? `https://img.youtube.com/vi/${item.videoId}/0.jpg` : item.channelImageUrl }} 
        style={styles.thumbnail} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.channelTitle}>{item.channelTitle}</Text>
      </View>
      {currentPlaying === item.id && (
        <View style={styles.controlsContainer}>
          <View style={styles.playingIndicator}>
            <Text style={styles.playingText}>正在播放</Text>
          </View>
          <EQControl
            currentPreset={currentEQPreset}
            onPresetChange={handleEQPresetChange}
          />
          <Text style={styles.eqStatusText}>
            EQ: {eqApplied ? '已應用' : '未應用'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  ), [navigation, currentPlaying, currentEQPreset, handleEQPresetChange, eqApplied]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>發現新播客</Text>
      <FlatList
        data={content}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 300,
        }}
        ref={flatListRef}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      />
      {currentPlaying && content.find(item => item.id === currentPlaying)?.type === 'youtube' && (
        <YoutubePlayer
          ref={youtubePlayerRef}
          height={0}
          play={true}
          videoId={content.find(item => item.id === currentPlaying)?.videoId}
          onReady={() => applyEQPreset(currentEQPreset)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  thumbnail: {
    width: width / 3,
    height: ITEM_HEIGHT - 60,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  channelTitle: {
    fontSize: 14,
    color: '#aaa',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  playingIndicator: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  playingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eqStatusText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 10,
  },
});

export default DiscoverScreen;