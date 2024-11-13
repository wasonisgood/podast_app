import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#3A3A3A',
    marginBottom: 30,
    fontFamily: 'Helvetica Neue',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#3A3A3A',
    marginBottom: 10,
    fontFamily: 'Helvetica Neue',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    color: '#3A3A3A',
    fontFamily: 'Helvetica Neue',
  },
  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  selectorOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorOptionSelected: {
    backgroundColor: '#4A4A4A',
  },
  selectorText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
  },
  selectorTextSelected: {
    color: '#FFFFFF',
  },
  // Difficulty selector styles
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  difficultyOption: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
  },
  difficultyOptionSelected: {
    backgroundColor: '#4A4A4A',
    borderColor: '#4A4A4A',
  },
  // Role selector styles
  roleContainer: {
    marginBottom: 20,
  },
  roleOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    marginBottom: 10,
  },
  roleOptionSelected: {
    backgroundColor: '#4A4A4A',
    borderColor: '#4A4A4A',
  },
  // Settings panel styles
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  settingsButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A4A4A',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#3A3A3A',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#3A3A3A',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#E0E0E0',
  },
  modalConfirmButton: {
    backgroundColor: '#4A4A4A',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // Progress styles
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A4A4A',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  // Generated result styles
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  // Settings panel specific styles
  settingsPanelContainer: {
    padding: 20,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#3A3A3A',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
    color: '#4A4A4A',
  },
  picker: {
    width: '100%',
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  generateButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#4A4A4A',
    fontSize: 16,
    marginLeft: 8,
  },
});