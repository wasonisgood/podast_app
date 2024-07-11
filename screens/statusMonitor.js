import { insertAd } from './adHandler';

export const onPlaybackStatusUpdate = async ({
  status, setDuration, setPosition, sound, 
  lastNonSilentTime, setLastNonSilentTime, silenceThreshold, silenceDuration 
}) => {
  if (status.isLoaded) {
    setDuration(status.durationMillis);
    setPosition(status.positionMillis);

    if (status.metering && status.metering < silenceThreshold) {
      if (status.positionMillis - lastNonSilentTime > silenceDuration) {
        await insertAd({ adSound: sound, isAdPlaying: false, setIsAdPlaying: () => {}, sound });
      }
    } else {
      setLastNonSilentTime(status.positionMillis);
    }
  } else if (status.error) {
    console.error('Playback error:', status.error);
  }
};
