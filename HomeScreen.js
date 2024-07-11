import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getPodcastChannels } from '../services/podcastService';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [channels, setChannels] = useState([]);
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const rssUrls = [
    'https://feed.firstory.me/rss/user/ckudnw7fn4tqg0870axzgirva',
    // Add more RSS URLs here
  ];

  useEffect(() => {
    fetchPodcastChannels();
    fetchFeaturedPodcasts();
    fetchCategories();
  }, []);

  const fetchPodcastChannels = async () => {
    const fetchedChannels = await getPodcastChannels(rssUrls);
    setChannels(fetchedChannels);
  };

  const fetchFeaturedPodcasts = async () => {
    // Implement this function to fetch featured podcasts
    const featured = [
      { id: '1', title: 'Featured Podcast 1', imageUrl: 'https://example.com/image1.jpg' },
      { id: '2', title: 'Featured Podcast 2', imageUrl: 'https://example.com/image2.jpg' },
      // Add more featured podcasts
    ];
    setFeaturedPodcasts(featured);
  };

  const fetchCategories = async () => {
    // Implement this function to fetch categories
    const cats = ['Arts', 'Business', 'Comedy', 'Education', 'News'];
    setCategories(cats);
  };

  const renderChannelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.channelItem}
      onPress={() => navigation.navigate('PodcastDetail', { channel: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.channelImage} />
      <Text style={styles.channelTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredItem}
      onPress={() => navigation.navigate('PodcastDetail', { channel: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <Text style={styles.featuredTitle}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('CategoryDetail', { category: item })}
    >
      <Text style={styles.categoryTitle}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Feather name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Featured</Text>
      <FlatList
        data={featuredPodcasts}
        renderItem={renderFeaturedItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.featuredList}
      />

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />

      <Text style={styles.sectionTitle}>Popular Channels</Text>
      <FlatList
        data={channels}
        renderItem={renderChannelItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.channelColumnWrapper}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 30,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  featuredList: {
    paddingLeft: 20,
  },
  featuredItem: {
    width: 300,
    height: 180,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesList: {
    paddingLeft: 20,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 16,
    color: '#495057',
  },
  channelColumnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  channelItem: {
    width: '48%',
    marginBottom: 20,
  },
  channelImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;