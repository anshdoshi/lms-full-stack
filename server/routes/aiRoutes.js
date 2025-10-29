import express from 'express';
import { 
    checkAIStatus,
    generateAITest,
    getAllTests,
    getTestById,
    submitTest,
    getTestResult,
    getUserTestHistory,
    aiChat,
    getChatHistory,
    getAllChatSessions
} from '../controllers/aiController.js';
import { authenticate } from '../middlewares/auth.js';

const aiRouter = express.Router();

// Public route - check AI status
aiRouter.get('/status', checkAIStatus);

// Protected routes - require authentication
aiRouter.use(authenticate);

// Test routes
aiRouter.post('/generate-test', generateAITest);
aiRouter.get('/tests', getAllTests);
aiRouter.get('/test/:testId', getTestById);
aiRouter.post('/submit-test', submitTest);
aiRouter.get('/result/:resultId', getTestResult);
aiRouter.get('/test-history', getUserTestHistory);

// Chat routes
aiRouter.post('/chat', aiChat);
aiRouter.get('/chat-history/:sessionId', getChatHistory);
aiRouter.get('/chat-sessions', getAllChatSessions);

export default aiRouter;
