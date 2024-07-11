// utils/audioUtils.js

export const applyEQToYouTube = (player, preset) => {
    if (!player || !player.getInternalPlayer) return;
  
    const youtubePlayer = player.getInternalPlayer();
    if (!youtubePlayer) return;
  
    // Access the audio context and source node
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(youtubePlayer);
  
    // Create and connect EQ filters
    const filters = preset.map((gain, index) => {
      const filter = audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = 60 * Math.pow(2, index);
      filter.Q.value = 1;
      filter.gain.value = gain;
      return filter;
    });
  
    // Connect the filters in series
    source.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(audioContext.destination);
  };