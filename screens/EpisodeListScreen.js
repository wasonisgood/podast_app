// screens/EpisodeListScreen.js
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import EpisodeCard from '../components/EpisodeCard';

const EpisodeListScreen = ({ route, navigation }) => {
  const { podcast } = route.params;

  const renderEpisode = ({ item }) => (
    <EpisodeCard
      episode={item}
      onPress={() => navigation.navigate('Player', { episode: item })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={podcast.episodes}
        renderItem={renderEpisode}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default EpisodeListScreen;