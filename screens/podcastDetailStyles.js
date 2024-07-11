import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // 淺灰色背景，營造簡潔感
  },
  channelHeaderImage: {
    width: '100%',
    height: 250, // 增加圖片高度，提升視覺衝擊力
    resizeMode: 'cover',
  },
  channelHeaderGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150, // 增加漸變高度
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },
  channelHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    fontFamily: 'Playfair Display, serif',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  channelContent: {
    padding: 20,
  },
  episodesHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 30,
    marginBottom: 20,
    fontFamily: 'Playfair Display, serif',
    letterSpacing: 1,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  episodeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
    fontFamily: 'Montserrat_600SemiBold',
  },
  episodeAuthor: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 3,
    fontFamily: 'Montserrat_400Regular',
  },
  episodeDate: {
    fontSize: 12,
    color: '#95A5A6',
    fontFamily: 'Montserrat_400Regular',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495E',
    fontFamily: 'Lato, sans-serif',
  },
  equalizerContainer: {
  marginTop: 20,
  alignItems: 'center',
},
equalizerTitle: {
  color: 'white',
  fontSize: 18,
  marginBottom: 10,
},
equalizerPresets: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
},
presetButton: {
  padding: 10,
  borderRadius: 5,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
},
activePreset: {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
},
presetText: {
  color: 'white',
},
});