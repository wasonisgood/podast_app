import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import { v4 as uuidv4 } from 'uuid'; // 引入 UUID 生成器

const AIPodcastGenerator = () => {
  // 基礎狀態
  const [step, setStep] = useState('input'); // input -> survey -> analysis -> dialogue
  const [wsStatus, setWsStatus] = useState('disconnected');
  const ws = useRef(null);
  const [topic, setTopic] = useState('');
  const [survey, setSurvey] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 音訊相關狀態
  const [dialogue, setDialogue] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundObject = useRef(null);
// 問題錯誤狀態管理
const [validationErrors, setValidationErrors] = useState({});

const renderQuestion = (question) => {
  const response = surveyResponses[question.question_id];
  const validationError = validationErrors[question.question_id];

  // 渲染問題標題和描述
  const QuestionHeader = () => (
    <>
      <Text style={styles.questionTitle}>
        {question.required && <Text style={styles.requiredMark}>* </Text>}
        {question.title}
      </Text>
      {question.description && (
        <Text style={styles.questionDesc}>{question.description}</Text>
      )}
    </>
  );

  // 處理答案更新
  const handleResponse = (value) => {
    console.log('Updating response:', question.question_id, value);
    let error = '';
    
    // 根據問題類型進行驗證
    if (question.validation) {
      switch (question.type) {
        case 'text':
          const length = value?.length || 0;
          if (length < question.validation.min_length) {
            error = `最少需要 ${question.validation.min_length} 個字`;
          } else if (length > question.validation.max_length) {
            error = `不能超過 ${question.validation.max_length} 個字`;
          }
          break;
          
        case 'multiple_choice':
          const selectedCount = (value || []).length;
          if (selectedCount < question.validation.min_select) {
            error = `至少選擇 ${question.validation.min_select} 項`;
          } else if (selectedCount > question.validation.max_select) {
            error = `最多選擇 ${question.validation.max_select} 項`;
          }
          break;
          
        case 'rating':
          if (value < question.validation.min) {
            error = `最小值為 ${question.validation.min}`;
          } else if (value > question.validation.max) {
            error = `最大值為 ${question.validation.max}`;
          }
          break;
      }
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [question.question_id]: error
    }));

    setSurveyResponses(prev => ({
      ...prev,
      [question.question_id]: value
    }));
  };

  switch (question.type) {
    case 'single_choice':
      return (
        <View key={question.question_id} style={styles.questionContainer}>
          <QuestionHeader />
          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option.option_id}
                style={[
                  styles.option,
                  response === option.value && styles.selectedOption
                ]}
                onPress={() => handleResponse(option.value)}
              >
                <View style={styles.optionRow}>
                  <View style={[
                    styles.radioButton,
                    response === option.value && styles.radioButtonSelected
                  ]}>
                    {response === option.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    response === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}
        </View>
      );

    case 'multiple_choice':
      const selectedValues = response || [];
      return (
        <View key={question.question_id} style={styles.questionContainer}>
          <QuestionHeader />
          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option.option_id}
                style={[
                  styles.option,
                  selectedValues.includes(option.value) && styles.selectedOption
                ]}
                onPress={() => {
                  const newValues = selectedValues.includes(option.value)
                    ? selectedValues.filter(v => v !== option.value)
                    : [...selectedValues, option.value];
                  handleResponse(newValues);
                }}
              >
                <View style={styles.optionRow}>
                  <View style={[
                    styles.checkbox,
                    selectedValues.includes(option.value) && styles.checkboxSelected
                  ]}>
                    {selectedValues.includes(option.value) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedValues.includes(option.value) && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}
        </View>
      );

    case 'rating':
      const maxRating = question.validation?.max || 5;
      const minRating = question.validation?.min || 1;
      return (
        <View key={question.question_id} style={styles.questionContainer}>
          <QuestionHeader />
          <View style={styles.ratingContainer}>
            {Array.from({ length: maxRating - minRating + 1 }, (_, i) => i + minRating).map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  response === rating && styles.selectedRating
                ]}
                onPress={() => handleResponse(rating)}
              >
                <Text style={[
                  styles.ratingText,
                  response === rating && styles.selectedRatingText
                ]}>
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}
        </View>
      );

    case 'text':
      return (
        <View key={question.question_id} style={styles.questionContainer}>
          <QuestionHeader />
          <TextInput
            style={[
              styles.textInput,
              Platform.OS === 'ios' ? { padding: 12 } : { textAlignVertical: 'top' }
            ]}
            multiline
            numberOfLines={4}
            value={response || ''}
            onChangeText={(text) => handleResponse(text)}
            placeholder="請輸入您的回答..."
            placeholderTextColor="#999"
            maxLength={question.validation?.max_length || 500}
          />
          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}
          <Text style={styles.textCounter}>
            {(response?.length || 0)} / {question.validation?.max_length || 500}
          </Text>
        </View>
      );

    default:
      return null;
  }
};

  const handleSurveyResponse = (questionId, value) => {
    setSurveyResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = async () => {
    if (soundObject.current) {
      try {
        await soundObject.current.unloadAsync();
      } catch (error) {
        console.error('清理音訊資源時出錯:', error);
      }
    }
  };

  const connectWebSocket = () => {
    try {
      const wsUrl = Platform.select({
        ios: 'ws://140.114.216.25:8888',
        android: 'ws://140.114.216.25:8888',
        default: 'ws://140.114.216.25:8888'
      });
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('WebSocket connection established');
        setWsStatus('connected');
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        setWsStatus('disconnected');
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsStatus('error');
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setWsStatus('error');
    }
  };

  const handleWebSocketMessage = (data) => {
    setIsLoading(false);
    
    if (data.status === 'success') {
      if (data.survey) {
        setSurvey(data.survey);
        setStep('survey');
      } else if (data.analysis) {
        setAnalysis(data.analysis);
        setStep('analysis');
      } else if (data.dialogue) {
        setDialogue(data.dialogue);
        setStep('dialogue');
      }
    } else if (data.status === 'section_ready') {
      setDialogue(prevDialogue => 
        prevDialogue.map(entry => 
          entry.id === data.id 
            ? { ...entry, audioFile: data.audio_file }
            : entry
        )
      );
    } else if (data.error) {
      Alert.alert('錯誤', data.error);
    }
  };
  const handleGenerateSurvey = () => {
    if (!topic.trim()) {
      Alert.alert('提示', '請輸入主題');
      return;
    }
  
    const surveyId = uuidv4(); // 生成唯一 ID
    setIsLoading(true);
  
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      connectWebSocket();
      setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          sendSurveyRequest(surveyId);
        } else {
          setIsLoading(false);
          Alert.alert('錯誤', '無法連接到服務器，請稍後重試');
        }
      }, 1000);
    } else {
      sendSurveyRequest(surveyId);
    }
  };
  
  const sendSurveyRequest = (surveyId) => {
    const message = {
      type: 'survey_generate',
      topic: topic,
      survey_id: surveyId // 傳遞生成的 ID
    };
    try {
      ws.current.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      Alert.alert('錯誤', '發送請求失敗，請重試');
    }
  };

  const handleSurveySubmit = () => {
    if (!survey || !survey.survey_id) {
      Alert.alert('錯誤', '未找到有效的問卷 ID');
      return;
    }
  
    // 檢查是否所有必填問題都已回答
    const unansweredQuestions = survey.sections.flatMap(section =>
      section.questions.filter(q =>
        q.required && !surveyResponses[q.question_id]
      )
    );
  
    if (unansweredQuestions.length > 0) {
      Alert.alert('提示', '請回答所有必填問題');
      return;
    }
  
    setIsLoading(true);
  
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'survey_submit',
        survey_id: survey.survey_id, // 傳遞問卷 ID
        responses: surveyResponses
      }));
    }
  };
  

  const handleGenerateDialogue = () => {
    if (!survey || !survey.survey_id) {
      Alert.alert('錯誤', '未找到有效的問卷 ID');
      return;
    }
  
    setIsLoading(true);
  
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'dialogue',
        topic: topic,
        survey_id: survey.survey_id, // 傳遞問卷 ID
        use_context: true
      };
  
      ws.current.send(JSON.stringify(message));
    }
  };
  
  const playAudio = async (audioFile) => {
    try {
      if (!audioFile) {
        console.warn('音訊文件尚未準備好');
        return;
      }

      // 如果有正在播放的音訊，先停止並卸載
      if (soundObject.current) {
        await soundObject.current.unloadAsync();
      }

      // 創建新的音訊對象並加載
      soundObject.current = new Audio.Sound();
      await soundObject.current.loadAsync({ uri: audioFile });
      
      // 開始播放
      await soundObject.current.playAsync();
      setIsPlaying(true);

      // 設置播放狀態更新處理
      soundObject.current.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          // 如果還有下一段音訊，自動播放
          if (currentAudioIndex < dialogue.length - 1) {
            setCurrentAudioIndex(prev => prev + 1);
            const nextAudio = dialogue[currentAudioIndex + 1].audioFile;
            if (nextAudio) {
              playAudio(nextAudio);
            }
          }
        }
      });
    } catch (error) {
      console.error('播放音訊時出錯:', error);
      Alert.alert('錯誤', '播放音訊時發生錯誤');
      setIsPlaying(false);
    }
  };

  const pauseAudio = async () => {
    if (soundObject.current) {
      try {
        await soundObject.current.pauseAsync();
        setIsPlaying(false);
      } catch (error) {
        console.error('暫停音訊時出錯:', error);
        Alert.alert('錯誤', '暫停音訊時發生錯誤');
      }
    }
  };

  const renderDialogueContent = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>播客內容</Text>
      <View style={styles.dialogueContainer}>
        {dialogue.map((entry, index) => (
          <View key={entry.id} style={styles.dialogueEntry}>
            <View style={styles.speakerInfo}>
              <Text style={styles.speakerName}>{entry.user || '講者'}</Text>
              {entry.audioFile && (
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    currentAudioIndex === index && isPlaying && styles.playingButton
                  ]}
                  onPress={() => {
                    if (currentAudioIndex === index && isPlaying) {
                      pauseAudio();
                    } else {
                      setCurrentAudioIndex(index);
                      playAudio(entry.audioFile);
                    }
                  }}
                >
                  <Text style={styles.playButtonText}>
                    {currentAudioIndex === index && isPlaying ? '暫停' : '播放'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.dialogueText}>{entry.text}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setStep('input')}
      >
        <Text style={styles.buttonText}>重新開始</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  const renderContent = () => {
    switch (step) {
      case 'input':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>AI 播客生成器</Text>
            <Text style={styles.subtitle}>第一步：確定主題</Text>
            <TextInput
              style={styles.topicInput}
              value={topic}
              onChangeText={setTopic}
              placeholder="請輸入您想要生成的播客主題..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerateSurvey}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>生成問卷</Text>
              )}
            </TouchableOpacity>
            {wsStatus === 'error' && (
              <Text style={styles.errorText}>伺服器連接失敗，請檢查網路連接</Text>
            )}
          </View>
        );

      case 'survey':
        return (
          <ScrollView style={styles.container}>
            <Text style={styles.title}>{survey.title || '問卷調查'}</Text>
            <Text style={styles.description}>{survey.description}</Text>
            {survey.sections.map((section) => (
              <View key={section.section_id} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDesc}>{section.description}</Text>
                {section.questions.map((question) => renderQuestion(question))}
              </View>
            ))}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSurveySubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>提交問卷</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        );

      case 'analysis':
        return (
          <ScrollView style={styles.container}>
            <Text style={styles.title}>分析結果</Text>
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisTitle}>知識水平</Text>
              <Text style={styles.analysisText}>
                {analysis.overview.knowledge_level.description}
              </Text>
              
              <Text style={styles.analysisTitle}>興趣領域</Text>
              {analysis.overview.interest_areas.map((area, index) => (
                <Text key={index} style={styles.analysisText}>
                  {area.area} (優先級: {area.priority})
                </Text>
              ))}
              
              <Text style={styles.analysisTitle}>建議方向</Text>
              {analysis.recommendations.key_points.map((point, index) => (
                <Text key={index} style={styles.analysisText}>• {point}</Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerateDialogue}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>生成對話</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        );

      case 'dialogue':
        return renderDialogueContent();

      default:
        return null;
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333'
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 15,
      color: '#666'
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      color: '#666'
    },
    errorText: {
      color: '#FF3B30',
      marginTop: 10,
      textAlign: 'center'
    },
    topicInput: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
      fontSize: 16
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600'
    },
    sectionContainer: {
      marginBottom: 30
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 10,
      color: '#333'
    },
    sectionDesc: {
      fontSize: 16,
      marginBottom: 15,
      color: '#666'
    },
  
      // 問卷相關樣式
      questionContainer: {
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }),
      },
      questionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333333',
        lineHeight: 24,
      },
      requiredMark: {
        color: '#F44336',
        fontWeight: 'bold',
      },
      questionDesc: {
        fontSize: 14,
        marginBottom: 12,
        color: '#666666',
        lineHeight: 20,
      },
      optionsContainer: {
        marginTop: 8,
      },
      optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      option: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
      },
      selectedOption: {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3',
      },
      optionText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
        marginLeft: 12,
      },
      selectedOptionText: {
        color: '#2196F3',
      },
      radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#757575',
        justifyContent: 'center',
        alignItems: 'center',
      },
      radioButtonSelected: {
        borderColor: '#2196F3',
      },
      radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
      },
      checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#757575',
        justifyContent: 'center',
        alignItems: 'center',
      },
      checkboxSelected: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
      },
      checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
      },
      ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        marginBottom: 8,
      },
      ratingButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
      },
      selectedRating: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
      },
      ratingText: {
        fontSize: 16,
        color: '#757575',
        fontWeight: '600',
      },
      selectedRatingText: {
        color: '#FFFFFF',
      },
      textInput: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        minHeight: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
      },
      textCounter: {
        fontSize: 12,
        color: '#757575',
        textAlign: 'right',
        marginTop: 4,
      },
      errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
      },
    optionsContainer: {
      marginTop: 10
    },
    option: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10
    },
    selectedOption: {
      backgroundColor: '#007AFF'
    },
    optionText: {
      fontSize: 16,
      color: '#333'
    },
    selectedOptionText: {
      color: '#fff'
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10
    },
    ratingButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#007AFF'
    },
    selectedRating: {
      backgroundColor: '#007AFF'
    },
    ratingText: {
      fontSize: 16,
      color: '#007AFF'
    },
    selectedRatingText: {
      color: '#fff'
    },
    textInput: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      height: 120,
      textAlignVertical: 'top',
      fontSize: 16
    },
    analysisContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      marginBottom: 20
    },
    analysisTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: '#333'
    },
    analysisText: {
      fontSize: 16,
      marginBottom: 8,
      color: '#666'
    },
    dialogueContainer: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
    },
    dialogueEntry: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 15,
    },
    speakerInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    speakerName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
    },
    dialogueText: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
    },
    playButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
    },
    playingButton: {
      backgroundColor: '#FF3B30',
    },
    playButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  return renderContent();
};

export default AIPodcastGenerator;