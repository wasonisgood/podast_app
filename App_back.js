import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Animated, Dimensions, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

import { generateAIPodcast, getAIRecommendations } from './services/aiService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    setPodcasts([
      { id: '1', title: '藝術與生活', author: 'Jane Doe', image: require('./assets/podcast1.webp') },
      { id: '2', title: '文學漫談', author: 'John Smith', image: require('./assets/podcast1.webp') },
      { id: '3', title: '城市印象', author: 'Emily Chen', image: require('./assets/podcast1.webp') },
      { id: '4', title: '音樂與靈感', author: 'Michael Wong', image: require('./assets/podcast1.webp') },
    ]);
  }, []);

  const renderPodcastItem = ({ item }) => (
    <TouchableOpacity
      style={styles.podcastItem}
      onPress={() => navigation.navigate('Player', { podcast: item })}
    >
      <Image source={item.image} style={styles.podcastImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
        style={styles.podcastGradient}
      >
        <Text style={styles.podcastTitle}>{item.title}</Text>
        <Text style={styles.podcastAuthor}>{item.author}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>發現</Text>
      <FlatList
        data={podcasts}
        renderItem={renderPodcastItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

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
        require('./assets/sample-audio.mp3'),
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

const AIGenerateScreen = () => {
  const [topic, setTopic] = useState('');
  const [generatedPodcast, setGeneratedPodcast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const podcast = await generateAIPodcast(topic);
    setGeneratedPodcast(podcast);
    setIsGenerating(false);
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.aiContainer}>
      <Text style={styles.aiHeaderText}>AI 播客生成器</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="輸入播客主題"
          placeholderTextColor="#A0A0A0"
          value={topic}
          onChangeText={setTopic}
        />
        <TouchableOpacity 
          style={[styles.generateButton, isGenerating && styles.generatingButton]} 
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Text style={styles.buttonText}>生成中...</Text>
          ) : (
            <Text style={styles.buttonText}>生成 AI 播客</Text>
          )}
        </TouchableOpacity>
      </View>
      {generatedPodcast && (
        <View style={styles.generatedPodcast}>
          <Text style={styles.generatedTitle}>{generatedPodcast.title}</Text>
          <Text style={styles.generatedContent}>{generatedPodcast.content}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'AI Generate') {
          iconName = focused ? 'bulb' : 'bulb-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#f5f5f5',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="AI Generate" component={AIGenerateScreen} />
  </Tab.Navigator>
);

export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    marginBottom: 20,
    color: '#333',
  },
  podcastItem: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  podcastImage: {
    width: '100%',
    height: '100%',
  },
  podcastGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  podcastTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  podcastAuthor: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#ddd',
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  playerImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginTop: 60,
    marginBottom: 30,
  },
  playerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  playerAuthor: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18,
    color: '#ddd',
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  timeText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#ddd',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  aiButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  aiContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  aiHeaderText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 30,
    marginTop: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generatingButton: {
    backgroundColor: '#45a049',
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: 'white',
    fontSize: 16,
  },
  generatedPodcast: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  generatedTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  generatedContent: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#ddd',
  },
});
