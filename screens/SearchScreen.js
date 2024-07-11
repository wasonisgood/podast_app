import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Animated, 
  Easing,
  Dimensions,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchPodcasts } from '../services/podcastService';

const { width } = Dimensions.get('window');

const rssUrls = [
  'https://feed.firstory.me/rss/user/ckudnw7fn4tqg0870axzgirva',
  'https://feed.firstory.me/rss/user/ckkhn2rmtod2m0831n3otw34x',
  'https://feed.firstory.me/rss/user/ckkkpa5m33o270854krnb65sz',
  'https://feeds.soundon.fm/podcasts/6cdfccc6-7c47-4c35-8352-7f634b1b6f71.xml',
  'https://feed.firstory.me/rss/user/ckz70ncpfpj9v08142bakdx3f',
  'https://feeds.soundon.fm/podcasts/a0e6b98f-4320-4f0f-90fe-afcd7f2a67ed.xml',
  'https://anchor.fm/s/1a348ea0/podcast/rss',
  'https://feed.firstory.me/rss/user/cl0ucpeqv001a0h098pfe1bex',
  'https://feeds.soundon.fm/podcasts/dc4cea72-85c0-48fd-ac38-4510dea35702.xml',
  'https://feeds.soundon.fm/podcasts/32aafa77-19a8-41dd-9aa4-62358554de91.xml',
  'https://feed.firstory.me/rss/user/clh8osfir0j6t01w28xl78r5w',
  'https://feed.firstory.me/rss/user/cleebhwcn00b101v32735gux1',
  // Add more RSS URLs here
];

const SearchScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchPodcasts(text, rssUrls);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const animateSearch = () => {
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start(() => {
      searchAnimation.setValue(0);
    });
  };

  const renderPodcastItem = ({ item }) => (
    <TouchableOpacity
      style={styles.episodeItem}
      onPress={() => {
        navigation.navigate('Player', { podcast: item, allEpisodes: searchResults });
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.episodeImage} />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.episodeAuthor}>{item.author}</Text>
        <Text style={styles.episodeDate}>{new Date(item.pubDate).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [
              {
                scale: searchAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1.1, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="search" size={24} color="#333" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="探索播客世界"
          placeholderTextColor="#a0a0a0"
          value={query}
          onChangeText={handleSearch}
          onFocus={animateSearch}
        />
      </Animated.View>

      {isSearching ? (
        <ActivityIndicator size="large" color="#333" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPodcastItem}
          ListEmptyComponent={
            query.length > 2 ? (
              <Text style={styles.noResultsText}>找不到相關播客，再試試別的關鍵字吧！</Text>
            ) : (
              <Text style={styles.initialText}>開始你的播客探索之旅吧！</Text>
            )
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    margin: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
    fontSize: 16,
  },
  initialText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  episodeItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  episodeImage: {
    width: 80,
    height: 80,
  },
  episodeInfo: {
    flex: 1,
    padding: 10,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  episodeAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  episodeDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default SearchScreen;
