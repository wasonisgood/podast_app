import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DonationScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [listeningHours, setListeningHours] = useState(0);
  const [donationPoints, setDonationPoints] = useState(0);
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchDonationData();
  }, []);

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchDonationData = async () => {
    // 這裡應該是從API獲取捐款數據
    // 為了示例，我們使用模擬數據
    setListeningHours(50);
    setDonationPoints(500);
    setDonationHistory([
      { id: 1, organization: '世界自然基金會', amount: 100, date: '2023-07-01' },
      { id: 2, organization: '無國界醫生', amount: 150, date: '2023-06-15' },
      { id: 3, organization: '台灣環境資訊協會', amount: 200, date: '2023-05-30' },
    ]);
  };

  const handleDonate = (amount) => {
    if (donationPoints >= amount) {
      Alert.alert(
        '確認捐款',
        `您確定要捐款 ${amount} 點數嗎？`,
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '確認', 
            onPress: () => {
              setDonationPoints(donationPoints - amount);
              // 這裡應該有API調用來更新服務器端數據
              Alert.alert('捐款成功', '感謝您的愛心！');
            }
          }
        ]
      );
    } else {
      Alert.alert('點數不足', '繼續聽力學習以獲得更多捐款點數！');
    }
  };

  const renderDonationItem = ({ item }) => (
    <View style={styles.donationItem}>
      <View>
        <Text style={styles.donationOrg}>{item.organization}</Text>
        <Text style={styles.donationDate}>{item.date}</Text>
      </View>
      <Text style={styles.donationAmount}>{item.amount} 點</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>你聽我捐</Text>
        <Text style={styles.headerSubtitle}>用知識的力量，傳遞愛與希望</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="headset" size={24} color="#E91E63" />
          <Text style={styles.statValue}>{listeningHours}</Text>
          <Text style={styles.statLabel}>累計聽力時數</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={24} color="#E91E63" />
          <Text style={styles.statValue}>{donationPoints}</Text>
          <Text style={styles.statLabel}>可用捐款點數</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>計畫說明</Text>
        <Text style={styles.infoText}>
          1. 每1小時的聽力學習可獲得10點捐款點數。{'\n'}
          2. 您可以選擇將點數捐給合作的慈善機構。{'\n'}
          3. 每100點相當於新台幣10元的實際捐款。{'\n'}
          4. 您的捐款將用於支持教育、環保、醫療等公益項目。{'\n'}
          5. 讓我們一起用知識的力量來改變世界！
        </Text>
      </View>

      <View style={styles.donationOptions}>
        <Text style={styles.donationTitle}>選擇捐款金額</Text>
        <View style={styles.donationButtons}>
          <TouchableOpacity style={styles.donateButton} onPress={() => handleDonate(100)}>
            <Text style={styles.donateButtonText}>100 點</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.donateButton} onPress={() => handleDonate(200)}>
            <Text style={styles.donateButtonText}>200 點</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.donateButton} onPress={() => handleDonate(500)}>
            <Text style={styles.donateButtonText}>500 點</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>捐款歷史</Text>
        <FlatList
          data={donationHistory}
          renderItem={renderDonationItem}
          keyExtractor={item => item.id.toString()}
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
  donationOptions: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    elevation: 2,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E4A59',
    marginBottom: 10,
  },
  donationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  donateButton: {
    backgroundColor: '#E91E63',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  donateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E4A59',
    marginBottom: 10,
  },
  donationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  donationOrg: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  donationDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  donationAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
});

export default DonationScreen;