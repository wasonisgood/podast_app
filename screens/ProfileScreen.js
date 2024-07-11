import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
    primary: '#3E4A59',
    secondary: '#8C9BAA',
    accent: '#D4A373',
    background: '#FFFFFF',
    text: '#2C3E50',
    lightText: '#7F8C8D',
    success: '#4CAF50',
    warning: '#FFA000',
  };
  
  const styles = {
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
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary + '30',
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
      color: colors.secondary,
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
  };

const mockUserData = {
  avatarUrl: 'https://www.example.com/avatar.jpg',
  name: '文青聽眾',
  email: 'literary.listener@example.com',
  points: 1200,
  treesPlanted: 5,
  donationsMade: 3,
};

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    fetchUserData();
    loadPreferences();
  }, []);

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(mockUserData);
    }
  };

  const loadPreferences = async () => {
    const darkModePref = await AsyncStorage.getItem('darkMode');
    const notificationsPref = await AsyncStorage.getItem('notifications');
    setDarkMode(darkModePref === 'true');
    setNotifications(notificationsPref !== 'false');
  };

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem('darkMode', newMode.toString());
  };

  const toggleNotifications = async () => {
    const newNotifState = !notifications;
    setNotifications(newNotifState);
    await AsyncStorage.setItem('notifications', newNotifState.toString());
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>正在載入您的文藝世界...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <FontAwesome5 name="leaf" size={24} color={colors.success} />
          <Text style={styles.statValue}>{user.points}</Text>
          <Text style={styles.statLabel}>聆聽點數</Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="tree" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{user.treesPlanted}</Text>
          <Text style={styles.statLabel}>種植的樹</Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="hand-holding-heart" size={24} color={colors.warning} />
          <Text style={styles.statValue}>{user.donationsMade}</Text>
          <Text style={styles.statLabel}>捐贈次數</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>學習與成長</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('LearningPlan')}>
          <Text style={styles.optionText}>聽力學習計畫</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ListeningHistory')}>
          <Text style={styles.optionText}>聆聽歷程</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Downloads')}>
          <Text style={styles.optionText}>已下載的集數</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>社會影響力</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('TreePlanting')}>
          <Text style={styles.optionText}>你聽我種樹</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Donations')}>
          <Text style={styles.optionText}>你聽我捐</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>帳戶設定</Text>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.optionText}>編輯個人資料</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Subscriptions')}>
          <Text style={styles.optionText}>管理訂閱</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
        <View style={styles.option}>
          <Text style={styles.optionText}>夜間模式</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.secondary, true: colors.accent }}
            thumbColor={darkMode ? colors.primary : colors.background}
          />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>通知</Text>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.secondary, true: colors.accent }}
            thumbColor={notifications ? colors.primary : colors.background}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>登出</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;