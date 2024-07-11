import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const AIGenerateScreen = () => {
  const [topic, setTopic] = useState('');
  const [voice, setVoice] = useState('男聲');
  const [speakerType, setSpeakerType] = useState('單人');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const VoiceSelector = ({ value, onSelect }) => (
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        style={[styles.selectorOption, value === '男聲' && styles.selectorOptionSelected]}
        onPress={() => onSelect('男聲')}
      >
        <Text style={[styles.selectorText, value === '男聲' && styles.selectorTextSelected]}>男聲</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorOption, value === '女聲' && styles.selectorOptionSelected]}
        onPress={() => onSelect('女聲')}
      >
        <Text style={[styles.selectorText, value === '女聲' && styles.selectorTextSelected]}>女聲</Text>
      </TouchableOpacity>
    </View>
  );

  const SpeakerTypeSelector = ({ value, onSelect }) => (
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        style={[styles.selectorOption, value === '單人' && styles.selectorOptionSelected]}
        onPress={() => onSelect('單人')}
      >
        <Text style={[styles.selectorText, value === '單人' && styles.selectorTextSelected]}>單人</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorOption, value === '雙人' && styles.selectorOptionSelected]}
        onPress={() => onSelect('雙人')}
      >
        <Text style={[styles.selectorText, value === '雙人' && styles.selectorTextSelected]}>雙人</Text>
      </TouchableOpacity>
    </View>
  );

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
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalConfirmButton]} onPress={onConfirm}>
              <Text style={styles.modalButtonText}>確認生成</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const GeneratingAnimation = () => (
    <View style={styles.generatingContainer}>
      <ActivityIndicator size="large" color="#4A4A4A" />
      <Text style={styles.generatingText}>正在生成您的 AI 播客...</Text>
    </View>
  );

  const GeneratedResult = ({ result, onAdjust }) => (
    <View style={styles.resultContainer}>
      <Text style={styles.resultTitle}>生成結果</Text>
      <Text style={styles.resultText}>{result.title}</Text>
      <TouchableOpacity style={styles.playButton}>
        <Feather name="play" size={20} color="#FFFFFF" />
        <Text style={styles.playButtonText}>試聽</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.adjustButton} onPress={onAdjust}>
        <Text style={styles.adjustButtonText}>調整生成結果</Text>
      </TouchableOpacity>
    </View>
  );

  const handleGenerate = () => {
    setShowTokenModal(true);
  };

  const handleConfirmGenerate = () => {
    setShowTokenModal(false);
    setIsGenerating(true);
    // 模擬生成過程
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedResult({
        title: `關於 "${topic}" 的 AI 播客`,
        audioUrl: 'https://example.com/audio.mp3'
      });
    }, 3000);
  };

  const handleAdjust = () => {
    // 這裡可以添加調整邏輯
    console.log('Adjusting generated result');
  };

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
          <Text style={styles.label}>選擇音色</Text>
          <VoiceSelector value={voice} onSelect={setVoice} />
          <Text style={styles.label}>單人或雙人</Text>
          <SpeakerTypeSelector value={speakerType} onSelect={setSpeakerType} />
          <TouchableOpacity style={styles.uploadButton}>
            <Feather name="upload" size={20} color="#4A4A4A" />
            <Text style={styles.uploadButtonText}>上傳參考資料</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
            <Text style={styles.generateButtonText}>生成</Text>
          </TouchableOpacity>
        </View>
        
        {isGenerating && <GeneratingAnimation />}
        {generatedResult && <GeneratedResult result={generatedResult} onAdjust={handleAdjust} />}
        
        <TokenModal 
          visible={showTokenModal} 
          onClose={() => setShowTokenModal(false)}
          onConfirm={handleConfirmGenerate}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = {
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5EBE0',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#4A4A4A',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Helvetica Neue',
  },
  generateButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Helvetica Neue',
  },
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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
  generatingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  generatingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3A3A3A',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#3A3A3A',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#3A3A3A',
    textAlign: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  adjustButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  adjustButtonText: {
    color: '#3A3A3A',
    fontSize: 16,
  },
};

export default AIGenerateScreen;