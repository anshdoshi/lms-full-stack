import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// Create axios instance with default config
const aiAPI = axios.create({
  baseURL: `${API_URL}/api/ai`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
aiAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AI Status
export const checkAIStatus = async () => {
  try {
    const response = await aiAPI.get('/status');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to check AI status' };
  }
};

// Test Generation
export const generateTest = async (testData) => {
  try {
    const response = await aiAPI.post('/generate-test', testData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to generate test' };
  }
};

// Get All Tests
export const getAllTests = async () => {
  try {
    const response = await aiAPI.get('/tests');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch tests' };
  }
};

// Get Test by ID
export const getTestById = async (testId) => {
  try {
    const response = await aiAPI.get(`/test/${testId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch test' };
  }
};

// Submit Test
export const submitTest = async (submissionData) => {
  try {
    const response = await aiAPI.post('/submit-test', submissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to submit test' };
  }
};

// Get Test Result
export const getTestResult = async (resultId) => {
  try {
    const response = await aiAPI.get(`/result/${resultId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch result' };
  }
};

// Get Test History
export const getTestHistory = async () => {
  try {
    const response = await aiAPI.get('/test-history');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch test history' };
  }
};

// Chat with AI
export const sendChatMessage = async (messageData) => {
  try {
    const response = await aiAPI.post('/chat', messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to send message' };
  }
};

// Get Chat History
export const getChatHistory = async (sessionId) => {
  try {
    const response = await aiAPI.get(`/chat-history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch chat history' };
  }
};

// Get All Chat Sessions
export const getChatSessions = async () => {
  try {
    const response = await aiAPI.get('/chat-sessions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch chat sessions' };
  }
};

export default aiAPI;
