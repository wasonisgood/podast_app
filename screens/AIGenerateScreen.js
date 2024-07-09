import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles';
import { generateAIPodcast } from '../services/aiService';

const AIGenerateScreen = () => {
  const [topic, setTopic] = useState('');
  const [generatedPodcast, setGeneratedPodcast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const podcast = await generateAIPodcast(topic);
    setGeneratedPodcast(podcast);
    setIsGenerating(false);
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.aiContainer}>
      <Text style={styles.aiHeaderText}>AI 播客生成器</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="輸入播客主題"
          placeholderTextColor="#A0A0A0"
          value={topic}
          onChangeText={setTopic}
        />
        <TouchableOpacity 
          style={[styles.generateButton, isGenerating && styles.generatingButton]} 
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Text style={styles.buttonText}>生成中...</Text>
          ) : (
            <Text style={styles.buttonText}>生成 AI 播客</Text>
          )}
        </TouchableOpacity>
      </View>
      {generatedPodcast && (
        <View style={styles.generatedPodcast}>
          <Text style={styles.generatedTitle}>{generatedPodcast.title}</Text>
          <Text style={styles.generatedContent}>{generatedPodcast.content}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default AIGenerateScreen;
