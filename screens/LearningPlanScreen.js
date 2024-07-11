import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LearningPlanScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [schoolAccount, setSchoolAccount] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchSchoolAccount();
    fetchLearningPlans();
  }, []);

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchSchoolAccount = async () => {
    // 這裡應該是從API獲取學校帳號信息
    // 為了示例，我們使用模擬數據
    setSchoolAccount({
      school: '清華大學',
      studentId: 'B12345678',
      verified: true
    });
  };

  const fetchLearningPlans = async () => {
    // 這裡應該是從API獲取學習計畫
    // 為了示例，我們使用模擬數據
    setLearningPlans([
      { id: 1, title: '科技英語聽力', hours: 10, completed: 5 },
      { id: 2, title: '文學賞析', hours: 15, completed: 7 },
      { id: 3, title: '世界文化探索', hours: 20, completed: 0 },
    ]);
  };

  const handlePlanPress = (plan) => {
    navigation.navigate('PlanDetail', { plan });
  };

  const handleLinkAccount = () => {
    Alert.alert(
      '綁定學校帳號',
      '請使用您的學校帳號登入以驗證身份。這將允許您的學習時數自動同步到學校系統。',
      [
        { text: '取消', style: 'cancel' },
        { text: '綁定', onPress: () => {/* 實現綁定邏輯 */} }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>聽力學習計畫</Text>
        <Text style={styles.headerSubtitle}>培養您的語言能力，拓展您的世界觀</Text>
      </View>

      {schoolAccount ? (
        <View style={styles.accountInfo}>
          <Text style={styles.accountText}>已綁定帳號：{schoolAccount.school} - {schoolAccount.studentId}</Text>
          {schoolAccount.verified && <Ionicons name="checkmark-circle" size={24} color="green" />}
        </View>
      ) : (
        <TouchableOpacity style={styles.linkButton} onPress={handleLinkAccount}>
          <Text style={styles.linkButtonText}>綁定學校帳號</Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>計畫說明</Text>
        <Text style={styles.infoText}>
          1. 本計畫與清大深耕扶弱計畫及其他學校的服務時數計畫相連接。{'\n'}
          2. 完成學習時數可獲得相應的服務時數認證。{'\n'}
          3. 每完成1小時的聽力學習，可獲得0.5小時的服務時數。{'\n'}
          4. 學習時數將自動同步到您的學校系統中。{'\n'}
          5. 請確保已綁定您的學校帳號以享受自動同步功能。
        </Text>
      </View>

      <View style={styles.planList}>
        <Text style={styles.planListTitle}>您的學習計畫</Text>
        {learningPlans.map(plan => (
          <TouchableOpacity key={plan.id} style={styles.planItem} onPress={() => handlePlanPress(plan)}>
            <View>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planProgress}>進度：{plan.completed}/{plan.hours}小時</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
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
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  accountText: {
    fontSize: 16,
    color: '#333',
  },
  linkButton: {
    backgroundColor: '#D4A373',
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  planList: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    elevation: 2,
  },
  planListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E4A59',
    marginBottom: 10,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  planProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default LearningPlanScreen;