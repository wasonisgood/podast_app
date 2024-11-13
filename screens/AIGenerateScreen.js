import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Animated,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { styles } from './AI_styles';

// 先註釋掉 socket.io 的導入，等後端準備好再使用
// import { io } from 'socket.io-client';

const WEBSOCKET_URL = 'YOUR_WEBSOCKET_SERVER_URL';
const DEV_MODE = true; // 開發模式標記

const AIGenerateScreen = () => {
  // State management
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('simple');
  const [interactionMode, setInteractionMode] = useState('auto');
  const [roleType, setRoleType] = useState('host-expert');
  const [voice, setVoice] = useState('male');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Settings state
  const [speed, setSpeed] = useState(1);
  const [emotion, setEmotion] = useState('neutral');
  const [pitch, setPitch] = useState('medium');

  // WebSocket reference
  const socketRef = useRef(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Mock WebSocket for development
  const mockWebSocketConnection = () => {
    console.log('Using mock WebSocket connection');
    return {
      emit: (event, data) => {
        console.log('Mock emit:', event, data);
      },
      disconnect: () => {
        console.log('Mock disconnect');
      }
    };
  };

  // WebSocket setup with error handling
  useEffect(() => {
    let mounted = true;

    const setupWebSocket = async () => {
      try {
        if (!DEV_MODE) {
          // 實際 WebSocket 連接的代碼，等後端準備好再啟用
          // socketRef.current = io(WEBSOCKET_URL);
          // socketRef.current.on('connect', () => {
          //   if (mounted) {
          //     setIsConnected(true);
          //     console.log('Connected to WebSocket server');
          //   }
          // });
        } else {
          // 開發模式使用 mock
          socketRef.current = mockWebSocketConnection();
          setIsConnected(true);
        }
      } catch (error) {
        console.error('WebSocket connection error:', error);
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    setupWebSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // 模擬生成過程
  const simulateGeneration = () => {
    setIsGenerating(true);
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      Animated.timing(progressAnimation, {
        toValue: currentProgress,
        duration: 300,
        useNativeDriver: false,
      }).start();

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setGeneratedResult({
          title: `關於 "${topic}" 的 AI 播客`,
          audioUrl: 'https://example.com/audio.mp3'
        });
      }
    }, 200);
  };

  // Component definitions
  const DifficultySelector = ({ value, onSelect }) => (
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        style={[styles.selectorOption, value === 'simple' && styles.selectorOptionSelected]}
        onPress={() => onSelect('simple')}
      >
        <Text style={[styles.selectorText, value === 'simple' && styles.selectorTextSelected]}>簡單</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorOption, value === 'medium' && styles.selectorOptionSelected]}
        onPress={() => onSelect('medium')}
      >
        <Text style={[styles.selectorText, value === 'medium' && styles.selectorTextSelected]}>中等</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorOption, value === 'hard' && styles.selectorOptionSelected]}
        onPress={() => onSelect('hard')}
      >
        <Text style={[styles.selectorText, value === 'hard' && styles.selectorTextSelected]}>困難</Text>
      </TouchableOpacity>
    </View>
  );

  const InteractionModeSelector = ({ value, onSelect }) => (
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        style={[styles.selectorOption, value === 'interactive' && styles.selectorOptionSelected]}
        onPress={() => onSelect('interactive')}
      >
        <Text style={[styles.selectorText, value === 'interactive' && styles.selectorTextSelected]}>互動式</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorOption, value === 'auto' && styles.selectorOptionSelected]}
        onPress={() => onSelect('auto')}
      >
        <Text style={[styles.selectorText, value === 'auto' && styles.selectorTextSelected]}>自動生成</Text>
      </TouchableOpacity>
    </View>
  );

  const RoleTypeSelector = ({ value, onSelect }) => (
    <View style={styles.roleContainer}>
      <TouchableOpacity
        style={[styles.roleOption, value === 'host-expert' && styles.roleOptionSelected]}
        onPress={() => onSelect('host-expert')}
      >
        <Text style={[styles.selectorText, value === 'host-expert' && styles.selectorTextSelected]}>
          主持人 vs 專家
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleOption, value === 'peer-discussion' && styles.roleOptionSelected]}
        onPress={() => onSelect('peer-discussion')}
      >
        <Text style={[styles.selectorText, value === 'peer-discussion' && styles.selectorTextSelected]}>
          同學討論
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleOption, value === 'teacher-student' && styles.roleOptionSelected]}
        onPress={() => onSelect('teacher-student')}
      >
        <Text style={[styles.selectorText, value === 'teacher-student' && styles.selectorTextSelected]}>
          老師教學
        </Text>
      </TouchableOpacity>
    </View>
  );

  // File upload handler with error handling
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setUploadedFile(result);
        if (socketRef.current && !DEV_MODE) {
          socketRef.current.emit('fileUpload', {
            name: result.name,
            uri: result.uri,
            type: result.mimeType,
          });
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('錯誤', '選擇文件時發生錯誤，請重試。');
    }
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      Alert.alert('提示', '請輸入播客主題');
      return;
    }
    setShowTokenModal(true);
  };

  const handleConfirmGenerate = () => {
    setShowTokenModal(false);

    if (DEV_MODE) {
      simulateGeneration();
      return;
    }

    if (!isConnected) {
      Alert.alert('錯誤', '無法連接到服務器，請檢查網絡連接後重試。');
      return;
    }

    setIsGenerating(true);

    if (socketRef.current) {
      socketRef.current.emit('startGeneration', {
        topic,
        difficulty,
        interactionMode,
        roleType,
        voice,
        settings: {
          speed,
          emotion,
          pitch
        },
        uploadedFile: uploadedFile ? {
          name: uploadedFile.name,
          uri: uploadedFile.uri
        } : null
      });
    }
  };

  // Token Modal Component
  const TokenModal = ({ visible, onClose, onConfirm }) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>代幣花費明細</Text>
          <Text style={styles.modalText}>生成播客: 10 代幣</Text>
          <Text style={styles.modalText}>音頻轉換: 5 代幣</Text>
          <Text style={styles.modalText}>總計: 15 代幣</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalCancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>確認生成</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Main render
  return (
    <LinearGradient colors={['#F5EBE0', '#E8DCCA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>AI 播客生成器</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>播客主題</Text>
          <TextInput
            style={styles.input}
            placeholder="輸入您的播客主題"
            placeholderTextColor="#A0A0A0"
            value={topic}
            onChangeText={setTopic}
          />

          <Text style={styles.label}>難度設置</Text>
          <DifficultySelector value={difficulty} onSelect={setDifficulty} />

          <Text style={styles.label}>互動模式</Text>
          <InteractionModeSelector value={interactionMode} onSelect={setInteractionMode} />

          <Text style={styles.label}>角色設定</Text>
          <RoleTypeSelector value={roleType} onSelect={setRoleType} />

          <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
            <Feather name="upload" size={20} color="#4A4A4A" />
            <Text style={styles.uploadButtonText}>
              {uploadedFile ? uploadedFile.name : '上傳參考資料'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.generateButton}
            onPress={handleGenerate}
          >
            <Text style={styles.generateButtonText}>開始生成</Text>
          </TouchableOpacity>
        </View>

        {isGenerating && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#4A4A4A" />
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                })}
              ]}
            />
            <Text style={styles.progressText}>{`生成進度: ${progress}%`}</Text>
          </View>
        )}

        {generatedResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.modalTitle}>{generatedResult.title}</Text>
            <TouchableOpacity style={styles.playButton}>
              <Feather name="play" size={20} color="#FFFFFF" />
              <Text style={styles.playButtonText}>試聽</Text>
            </TouchableOpacity>
          </View>
        )}

        <TokenModal
          visible={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          onConfirm={handleConfirmGenerate}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default AIGenerateScreen;