import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    marginBottom: 20,
    color: '#333',
  },
  podcastItem: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  podcastImage: {
    width: '100%',
    height: '100%',
  },
  podcastGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  podcastTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  podcastAuthor: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#ddd',
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  playerImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginTop: 60,
    marginBottom: 30,
  },
  playerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  playerAuthor: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18,
    color: '#ddd',
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  timeText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#ddd',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  aiButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  aiContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  aiHeaderText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 30,
    marginTop: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generatingButton: {
    backgroundColor: '#45a049',
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: 'white',
    fontSize: 16,
  },
  generatedPodcast: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  generatedTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  generatedContent: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#ddd',
  },
  lyricContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lyricText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
