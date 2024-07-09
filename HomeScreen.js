import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import { getPodcastEpisodes } from './services/podcastService';

const HomeScreen = ({ navigation }) => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    setPodcasts([
      { id: '1', title: '藝術與生活', author: 'Jane Doe', image: require('./assets/podcast1.webp') },
      { id: '2', title: '文學漫談', author: 'John Smith', image: require('./assets/podcast1.webp') },
      { id: '3', title: '城市印象', author: 'Emily Chen', image: require('./assets/podcast1.webp') },
      { id: '4', title: '音樂與靈感', author: 'Michael Wong', image: require('./assets/podcast1.webp') },
    ]);
    fetchPodcastEpisodes();
  }, []);

  const fetchPodcastEpisodes = async () => {
    const episodes = await getPodcastEpisodes();
    setPodcasts(prevPodcasts => [...prevPodcasts, ...episodes]);
  };

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

export default HomeScreen;
