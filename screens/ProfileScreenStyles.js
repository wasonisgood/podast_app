import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#3E4A59',
  secondary: '#8C9BAA',
  accent: '#D4A373',
  background: '#F6F6F6',
  text: '#2C3E50',
  lightText: '#7F8C8D',
  success: '#4CAF50',
  warning: '#FFA000',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: colors.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: colors.accent,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    paddingBottom: 5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary + '30',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 50,
    backgroundColor: colors.warning,
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  logoutText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
    fontStyle: 'italic',
  },
});