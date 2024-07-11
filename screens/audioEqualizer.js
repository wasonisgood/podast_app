// audioEqualizer.js

import { Audio } from 'expo-av';

let audioContext;
let sourceNode;
let equalizerNode;

const createAudioContext = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
  }
};

const createEqualizerNode = () => {
  if (!equalizerNode) {
    equalizerNode = audioContext.createBiquadFilter();
    equalizerNode.type = 'peaking';
    equalizerNode.frequency.value = 1000; // Default center frequency
    equalizerNode.Q.value = 1; // Default Q factor
    equalizerNode.gain.value = 0; // Default gain
  }
};

export const initializeEqualizer = async (sound) => {
  await createAudioContext();
  createEqualizerNode();

  if (sound && sound._loaded) {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      sourceNode = audioContext.createMediaStreamSource(status.androidImplementation.streamSource);
      sourceNode.connect(equalizerNode);
      equalizerNode.connect(audioContext.destination);
    }
  }
};

export const applyEqualizerPreset = (preset) => {
  if (!equalizerNode) return;

  switch (preset) {
    case 'bass_boost':
      equalizerNode.frequency.value = 100;
      equalizerNode.gain.value = 7;
      break;
    case 'treble_boost':
      equalizerNode.frequency.value = 5000;
      equalizerNode.gain.value = 5;
      break;
    case 'vocal_enhance':
      equalizerNode.frequency.value = 2000;
      equalizerNode.gain.value = 3;
      break;
    default:
      // Reset to flat response
      equalizerNode.frequency.value = 1000;
      equalizerNode.gain.value = 0;
  }
};

export const setCustomEqualizer = (frequency, gain, q) => {
  if (!equalizerNode) return;

  equalizerNode.frequency.value = frequency;
  equalizerNode.gain.value = gain;
  equalizerNode.Q.value = q;
};

export const disconnectEqualizer = () => {
  if (sourceNode && equalizerNode) {
    sourceNode.disconnect();
    equalizerNode.disconnect();
  }
};