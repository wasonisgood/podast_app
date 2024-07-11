import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import PodcastDetailScreen from './screens/PodcastDetailScreen';
import EpisodeListScreen from './screens/EpisodeListScreen';
import PlayerScreen from './screens/PlayerScreen';
import AIGenerateScreen from './screens/AIGenerateScreen';
import DonationScreen from './screens/DonationScreen';
import LearningPlanScreen from './screens/LearningPlanScreen';
import TreePlantingScreen from './screens/TreePlantingScreen';
import { PlayerProvider, PlayerContext } from './PlayerContext';
import MiniPlayer from './screens/MiniPlayer';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Discover') {
          iconName = focused ? 'compass' : 'compass-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Generate') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Discover" component={DiscoverScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Generate" component={AIGenerateScreen} />
  </Tab.Navigator>
);

const AppContent = () => {
  const { miniPlayerVisible, currentEpisode, isPlaying, playPause, closeMiniPlayer, openPlayerScreen } = useContext(PlayerContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="PodcastDetail" component={PodcastDetailScreen} />
        <Stack.Screen name="EpisodeList" component={EpisodeListScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="TreePlanting" component={TreePlantingScreen} />
        <Stack.Screen name="LearningPlan" component={LearningPlanScreen} />
        <Stack.Screen name="Donations" component={DonationScreen} />
      </Stack.Navigator>
      {miniPlayerVisible && currentEpisode && (
        <MiniPlayer
          podcastTitle={currentEpisode.podcastTitle}
          episodeTitle={currentEpisode.title}
          coverImage={currentEpisode.imageUrl}
          isPlaying={isPlaying}
          onPlayPause={playPause}
          onClose={closeMiniPlayer}
          onOpen={openPlayerScreen}
        />
      )}
    </NavigationContainer>
  );
};

const App = () => (
  <PlayerProvider>
    <AppContent />
  </PlayerProvider>
);

export default App;
