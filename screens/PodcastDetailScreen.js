import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RenderHTML from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import styles from './podcastDetailStyles';

const PodcastDetailScreen = ({ route, navigation }) => {
  const { channel } = route.params;
  const { width } = Dimensions.get('window');

  const renderEpisodeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.episodeItem}
      onPress={() => {
        navigation.navigate('Player', { podcast: item, allEpisodes: channel.episodes });
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

  const tagsStyles = {
    body: { color: '#34495E', fontFamily: 'Lato, sans-serif' },
    p: { marginBottom: 10 },
    a: { color: '#3498DB' },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Image source={{ uri: channel.imageUrl }} style={styles.channelHeaderImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.channelHeaderGradient}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.channelHeaderTitle}>{channel.title}</Text>
          </LinearGradient>
        </View>
        <View style={styles.channelContent}>
          <View style={styles.descriptionContainer}>
            <RenderHTML
              source={{ html: channel.description }}
              contentWidth={width - 40}
              tagsStyles={tagsStyles}
            />
          </View>
          <Text style={styles.episodesHeader}>Episodes</Text>
          <FlatList
            data={channel.episodes}
            renderItem={renderEpisodeItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PodcastDetailScreen;
