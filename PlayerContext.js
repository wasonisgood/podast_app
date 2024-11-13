import React, { createContext, useState } from 'react';
import { Audio } from 'expo-av';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const playPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const closeMiniPlayer = () => {
    if (sound) {
      sound.stopAsync();
      setIsPlaying(false);
    }
    setMiniPlayerVisible(false);
  };

  const openPlayerScreen = () => {
    // 实现打开播放器屏幕的逻辑
  };

  const stopOtherPlaybacks = async () => {
    try {
      console.log('Stopping other playbacks');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // 或 INTERRUPTION_MODE_IOS_DUCK_OTHERS
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
      });
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping other playbacks:', error);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        miniPlayerVisible,
        setMiniPlayerVisible,
        currentEpisode,
        setCurrentEpisode,
        isPlaying,
        playPause,
        closeMiniPlayer,
        openPlayerScreen,
        stopOtherPlaybacks,
        setSound,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
