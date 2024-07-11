import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TreePlantingScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [treeCount, setTreeCount] = useState(0);
  const [listeningHours, setListeningHours] = useState(0);

  useEffect(() => {
    fetchUserData();
    fetchTreeData();
  }, []);

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchTreeData = async () => {
    // 這裡應該是從API獲取種樹數據
    // 為了示例，我們使用模擬數據
    setTreeCount(5);
    setListeningHours(50);
  };

  const handlePlantTree = () => {
    if (listeningHours >= 10) {
      setTreeCount(treeCount + 1);
      setListeningHours(listeningHours - 10);
      // 這裡應該有API調用來更新服務器端數據
    } else {
      alert('您的聽力時數不足以種植新的樹。繼續學習以獲得更多時數！');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>你聽我種樹</Text>
        <Text style={styles.headerSubtitle}>讓知識的種子成長為綠色的森林</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="headset" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{listeningHours}</Text>
          <Text style={styles.statLabel}>累計聽力時數</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="leaf" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{treeCount}</Text>
          <Text style={styles.statLabel}>已種樹數量</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>計畫說明</Text>
        <Text style={styles.infoText}>
          1. 每累計10小時的聽力學習時數，您就可以種植一棵虛擬樹。{'\n'}
          2. 每棵虛擬樹都代表著真實世界中的一棵樹苗。{'\n'}
          3. 我們與各地環保組織合作，將根據您種植的虛擬樹數量在適合的地區種植實體樹木。{'\n'}
          4. 您可以在地圖上查看您貢獻的樹木分佈情況。{'\n'}
          5. 一起為地球增添綠色，讓知識與自然共同成長！
        </Text>
      </View>

      <TouchableOpacity style={styles.plantButton} onPress={handlePlantTree}>
        <Text style={styles.plantButtonText}>種植一棵樹</Text>
      </TouchableOpacity>

      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>您的樹木分佈圖</Text>
        <Image
          source={require('../assets/podcast1.webp')}
          style={styles.mapImage}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#3E4A59',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D4A373',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E4A59',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E4A59',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  plantButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  plantButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    elevation: 2,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E4A59',
    marginBottom: 10,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

export default TreePlantingScreen;