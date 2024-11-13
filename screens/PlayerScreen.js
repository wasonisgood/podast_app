import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Modal, FlatList, Dimensions, Alert, ActivityIndicator, PanResponder, AppState } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import styles from './playerScreenStyles';
import { PlayerContext } from '../PlayerContext';
import * as Network from 'expo-network';

const PlayerScreen = ({ navigation, route }) => {
  const { podcast, allEpisodes } = route.params;
  const { sound, setSound, setMiniPlayerVisible, setCurrentEpisode, stopOtherPlaybacks, isPlaying, playPause } = useContext(PlayerContext);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { width } = Dimensions.get('window');
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(
    allEpisodes.findIndex(episode => episode.id === podcast.id)
  );

  const [adSound, setAdSound] = useState(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [lastNonSilentTime, setLastNonSilentTime] = useState(0);
  const silenceThreshold = -50; // 靜音閾值，單位為分貝
  const silenceDuration = 2000; // 檢測靜音的持續時間，單位為毫秒

  const lyrics = [
    "這是第一行歌詞", "這是第二行歌詞", "這是第三行歌詞",
    "這是第四行歌詞", "這是第五行歌詞",
  ];

  const aiOptions = [
    { id: '1', title: '生成歌詞概要' },
    { id: '2', title: '翻譯歌詞' },
    { id: '3', title: '分析歌曲情感' },
    { id: '4', title: '推薦相似歌曲' },
  ];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: Animated.event([null, { dy: scrollY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Downward swipe detected, minimize player
          setMiniPlayerVisible(true);
          navigation.goBack();
        } else {
          // Reset position
          Animated.spring(scrollY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    loadAudio();
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (adSound) {
        adSound.unloadAsync();
      }
      subscription.remove();
    };
  }, [currentEpisodeIndex]);

  const handleAppStateChange = async (nextAppState) => {
    console.log('AppState changed to', nextAppState);
    if (nextAppState.match(/inactive|background/) && isPlaying) {
      console.log('App is going to the background, keeping audio playing');
      await sound.setStatusAsync({ shouldPlay: true, staysActiveInBackground: true, playsInBackground: true });
    }
  };

  const loadAudio = async () => {
    try {
      console.log('Loading audio...');
      setIsLoading(true);
      setLoadingProgress(0);

      const netInfo = await Network.getNetworkStateAsync();
      if (!netInfo.isConnected || !netInfo.isInternetReachable) {
        throw new Error('No internet connection');
      }

      if (typeof stopOtherPlaybacks === 'function') {
        await stopOtherPlaybacks();
      }

      if (sound) {
        await sound.unloadAsync();
      }

      const currentEpisode = allEpisodes[currentEpisodeIndex];
      if (!currentEpisode || !currentEpisode.audioUrl) {
        throw new Error('Invalid episode or audio URL');
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentEpisode.audioUrl },
        { shouldPlay: false, staysActiveInBackground: true, playsInBackground: true },
        onPlaybackStatusUpdate,
        onLoadProgress
      );

      // 預加載本地廣告音訊
      const { sound: newAdSound } = await Audio.Sound.createAsync(
        require('../assets/sample-audio.mp3'), // 將 'ad-audio.mp3' 放在您的項目中的 assets 文件夾
        { shouldPlay: false }
      );
      setAdSound(newAdSound);

      setSound(newSound);
      setCurrentEpisode(currentEpisode);
      setIsLoading(false);
      console.log('Audio loaded successfully');
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      if (error.message === 'No internet connection') {
        Alert.alert('網絡錯誤', '請檢查您的網絡連接並重試。');
      } else if (error.message === 'Invalid episode or audio URL') {
        Alert.alert('數據錯誤', '無效的音頻數據。請聯繫支持團隊。');
      } else {
        Alert.alert('加載錯誤', `無法加載音頻文件：${error.message}`);
      }
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);

      // 檢測靜音段落
      if (status.metering && status.metering < silenceThreshold) {
        if (status.positionMillis - lastNonSilentTime > silenceDuration) {
          await insertAd();
        }
      } else {
        setLastNonSilentTime(status.positionMillis);
      }
    } else if (status.error) {
      console.error('Playback error:', status.error);
    }
  };

  const insertAd = async () => {
    if (adSound && !isAdPlaying) {
      setIsAdPlaying(true);
      await sound.pauseAsync();
      await adSound.playAsync();
      adSound.setOnPlaybackStatusUpdate(async (adStatus) => {
        if (adStatus.didJustFinish) {
          setIsAdPlaying(false);
          await sound.playAsync();
        }
      });
    }
  };

  const onLoadProgress = (data) => {
    if (data.totalBytesExpectedToWrite > 0) {
      const progress = data.totalBytesWritten / data.totalBytesExpectedToWrite;
      setLoadingProgress(progress);
    }
  };

  const seekAudio = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  };

  const playPreviousTrack = () => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(prevIndex => prevIndex - 1);
    }
  };

  const playNextTrack = () => {
    if (currentEpisodeIndex < allEpisodes.length - 1) {
      setCurrentEpisodeIndex(prevIndex => prevIndex + 1);
    }
  };

  const renderLyric = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp'
    });
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp'
    });
    return (
      <Animated.View style={[styles.lyricContainer, { width: width, opacity, transform: [{ scale }] }]}>
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

  const renderAIOption = ({ item }) => (
    <TouchableOpacity style={styles.aiOptionButton} onPress={() => handleAIOption(item.id)}>
      <Text style={styles.aiOptionButtonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const handleAIOption = (optionId) => {
    console.log(`選擇了 AI 功能: ${optionId}`);
    setShowAIModal(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isPlaying) {
        e.preventDefault();
        setMiniPlayerVisible(true);
        setTimeout(() => {
          navigation.dispatch(e.data.action);
        }, 0);
      }
    });

    return unsubscribe;
  }, [navigation, isPlaying]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradientBackground}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          setMiniPlayerVisible(true);
          navigation.goBack();
        }}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>正在加載音頻... {Math.round(loadingProgress * 100)}%</Text>
          </View>
        ) : (
          <>
            <Image source={{ uri: allEpisodes[currentEpisodeIndex].imageUrl }} style={styles.playerImage} />
            <Text style={styles.playerTitle}>{allEpisodes[currentEpisodeIndex].title}</Text>
            <Text style={styles.playerAuthor}>{allEpisodes[currentEpisodeIndex].author}</Text>
            
            <Animated.FlatList
              data={lyrics}
              renderItem={renderLyric}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollY } } }],
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
              <TouchableOpacity style={styles.controlButton} onPress={playPreviousTrack}>
                <Ionicons name="play-skip-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton} onPress={playPause}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={playNextTrack}>
                <Ionicons name="play-skip-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.aiButtonsContainer}>
              <TouchableOpacity style={styles.aiButton} onPress={() => setShowAIModal(true)}>
                <Ionicons name="bulb-outline" size={20} color="white" />
                <Text style={styles.aiButtonText}>AI 功能</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.aiButton}>
                <Ionicons name="chatbubble-outline" size={20} color="white" />
                <Text style={styles.aiButtonText}>聊天</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.aiButton}>
                <Ionicons name="share-outline" size={20} color="white" />
                <Text style={styles.aiButtonText}>分享</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.debugInfo}>
              <Text style={styles.debugText}>Is Playing: {isPlaying ? 'Yes' : 'No'}</Text>
              <Text style={styles.debugText}>Duration: {formatTime(duration)}</Text>
              <Text style={styles.debugText}>Position: {formatTime(position)}</Text>
            </View>
          </>
        )}

        {isAdPlaying && (
          <View style={styles.adOverlay}>
            <Text style={styles.adText}>廣告播放中</Text>
          </View>
        )}
      </LinearGradient>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showAIModal}
        onRequestClose={() => setShowAIModal(false)}
      >
        <View style={styles.aiModalContainer}>
          <View style={styles.aiModalContent}>
            <Text style={styles.aiModalTitle}>AI 功能</Text>
            <FlatList
              data={aiOptions}
              renderItem={renderAIOption}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlayerScreen;
