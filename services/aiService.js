// services/aiService.js

import axios from 'axios';

// 假設我們使用 OpenAI 的 API
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// 生成 AI 播客
export async function generateAIPodcast(topic) {
  try {
    const response = await axios.post(OPENAI_API_URL, {
      prompt: `Generate a podcast script about ${topic}. Include a title, introduction, main content, and conclusion.`,
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const generatedText = response.data.choices[0].text;
    const [title, ...content] = generatedText.split('\n').filter(line => line.trim() !== '');

    return {
      title: title.replace('Title: ', ''),
      content: content.join('\n'),
    };
  } catch (error) {
    console.error('Error generating AI podcast:', error);
    throw error;
  }
}

// 獲取 AI 推薦
export async function getAIRecommendations(userPreferences) {
  try {
    const response = await axios.post(OPENAI_API_URL, {
      prompt: `Based on the user preferences: ${JSON.stringify(userPreferences)}, recommend 5 podcast topics.`,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.6,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const recommendationsText = response.data.choices[0].text;
    return recommendationsText.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
}

// 文本轉語音（TTS）
export async function textToSpeech(text) {
  // 這裡應該實現實際的 TTS 邏輯
  // 可以使用 Google Cloud Text-to-Speech API 或其他 TTS 服務
  console.log('Text-to-Speech not implemented yet');
  return 'audio_url_placeholder';
}