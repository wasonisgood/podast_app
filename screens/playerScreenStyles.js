import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  playerImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  playerTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  playerAuthor: {
    fontFamily: 'Lato, sans-serif',
    fontSize: 18,
    color: '#B2BABB',
    textAlign: 'center',
    marginBottom: 30,
  },
  lyricContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricText: {
    fontFamily: 'Lato, sans-serif',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  timeText: {
    fontFamily: 'Lato, sans-serif',
    fontSize: 14,
    color: '#B2BABB',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 15,
  },
  playButton: {
    backgroundColor: '#1DB954',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 30,
  },
  aiButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  aiButtonText: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
  aiModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  aiModalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  aiModalTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  aiOptionButton: {
    backgroundColor: '#2C3E50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  aiOptionButtonText: {
    fontFamily: 'Lato, sans-serif',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
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