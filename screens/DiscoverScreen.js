import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Audio } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { fetchContent } from '../services/contentService';
import EQControl from '../services/EQControl';
import { applyEQToYouTube } from '../services/audioUtils';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ContentItem = memo(({ item, currentPlaying, currentEQPreset, handleEQPresetChange, eqApplied, animationRef, youtubePlayerRef, applyEQPreset }) => {
  return (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.type === 'youtube' ? `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg` : item.channelImageUrl }} 
        style={styles.thumbnail} 
      />
      {item.type === 'youtube' && currentPlaying === item.id && (
        <YoutubePlayer
          ref={youtubePlayerRef}
          height={height}
          play={true}
          videoId={item.videoId}
          onReady={() => applyEQPreset(currentEQPreset)}
        />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      >
        <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.channelTitle}>{item.channelTitle}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 name="comment-alt" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>评论</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 name="share-alt" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>分享</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 name="heart" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>喜欢</Text>
          </TouchableOpacity>
        </View>
        {currentPlaying === item.id && (
          <Animated.View style={[styles.playAnimation, {
            transform: [{
              rotate: animationRef.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            }],
          }]}>
            <FontAwesome5 name="play-circle" size={50} color="#FFFFFF" />
          </Animated.View>
        )}
        {currentPlaying === item.id && (
          <View style={styles.controlsContainer}>
            <EQControl
              currentPreset={currentEQPreset}
              onPresetChange={handleEQPresetChange}
            />
            <Text style={styles.eqStatusText}>
              EQ: {eqApplied ? '已应用 🎵' : '未应用 🔇'}
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
});

const DiscoverScreen = ({ navigation }) => {
  const [content, setContent] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [currentEQPreset, setCurrentEQPreset] = useState(0);
  const [eqApplied, setEqApplied] = useState(false);
  const flatListRef = useRef();
  const audioRef = useRef(new Audio.Sound());
  const youtubePlayerRef = useRef(null);
  const playbackTimerRef = useRef(null);
  const animationRef = useRef(new Animated.Value(0)).current;

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
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentPlaying) {
      Animated.loop(
        Animated.timing(animationRef, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      animationRef.setValue(0);
    }
  }, [currentPlaying]);

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

  const playAudio = useCallback(async (item) => {
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
        // YouTube playback is handled by YoutubePlayer component
      }

      playbackTimerRef.current = setTimeout(() => {
        moveToNextItem();
      }, 60000);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [currentEQPreset]);

  const moveToNextItem = useCallback(() => {
    if (content.length === 0) return;
    const currentIndex = content.findIndex(item => item.id === currentPlaying);
    const nextIndex = (currentIndex + 1) % content.length;
    if (flatListRef.current && nextIndex >= 0 && nextIndex < content.length) {
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentPlaying(content[nextIndex].id);
      playAudio(content[nextIndex]);
    }
  }, [content, currentPlaying, playAudio]);

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const { item } = viewableItems[0];
      if (currentPlaying !== item.id) {
        setCurrentPlaying(item.id);
        playAudio(item);
      }
    }
  }, [currentPlaying, playAudio]);

  const handleEQPresetChange = useCallback(async (presetIndex) => {
    setCurrentEQPreset(presetIndex);
    await applyEQPreset(presetIndex);
  }, [applyEQPreset]);

  const renderItem = useCallback(({ item }) => (
    <ContentItem
      item={item}
      currentPlaying={currentPlaying}
      currentEQPreset={currentEQPreset}
      handleEQPresetChange={handleEQPresetChange}
      eqApplied={eqApplied}
      animationRef={animationRef}
      youtubePlayerRef={youtubePlayerRef}
      applyEQPreset={applyEQPreset}
    />
  ), [currentPlaying, currentEQPreset, handleEQPresetChange, eqApplied, animationRef, youtubePlayerRef, applyEQPreset]);

  return (
    <View style={styles.container}>
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
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={50}
        initialNumToRender={2}
        windowSize={3}
        onEndReached={() => {
          console.warn('VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc.');
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  itemContainer: {
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 100,
  },
  episodeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  channelTitle: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 12,
    width: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    marginTop: 5,
    fontSize: 14,
  },
  playAnimation: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 10,
  },
  eqStatusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiscoverScreen;
