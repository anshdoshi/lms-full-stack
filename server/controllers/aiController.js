import { GoogleGenerativeAI } from '@google/generative-ai';
import AITest from '../models/AITest.js';
import TestResult from '../models/TestResult.js';
import ChatHistory from '../models/ChatHistory.js';
import User from '../models/User.js';

// Check if AI is configured
const isAIConfigured = () => {
    return !!(process.env.GEMINI_API_KEY);
};

// Initialize Gemini client
const getGeminiClient = () => {
    if (!isAIConfigured()) {
        throw new Error('AI service is currently under maintenance. Please try again later.');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-2.0-flash-lite for free tier (fast and efficient)
    return genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-lite'
    });
};

// Check AI Status
export const checkAIStatus = async (req, res) => {
    try {
        const configured = isAIConfigured();
        res.json({
            success: true,
            configured,
            message: configured ? 'AI service is available' : 'AI service is under maintenance'
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Generate AI Test
export const generateAITest = async (req, res) => {
    try {
        if (!isAIConfigured()) {
            return res.json({
                success: false,
                message: 'AI service is currently under maintenance. Please try again later.',
                underMaintenance: true
            });
        }

        const { subject, difficulty, numberOfQuestions } = req.body;

        if (!subject || !difficulty || !numberOfQuestions) {
            return res.json({ success: false, message: 'Please provide all required fields' });
        }

        const model = getGeminiClient();

        const prompt = `You are an expert CA (Chartered Accountant) educator creating high-quality test questions for Indian CA students. Focus on practical knowledge and exam-relevant topics.

Generate a ${difficulty} level CA test on ${subject} with ${numberOfQuestions} multiple choice questions.

For each question, provide:
1. Question text (clear and professional)
2. Four options (A, B, C, D)
3. Correct answer (index 0-3)
4. Detailed explanation

Format the response as a valid JSON object with this exact structure:
{
  "title": "Test title",
  "description": "Brief description",
  "questions": [
    {
      "questionText": "Question here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation"
    }
  ]
}

Make questions relevant to CA curriculum and Indian accounting standards. Return ONLY the JSON object, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response (Gemini might include markdown code blocks)
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }
        
        const generatedContent = JSON.parse(jsonText);

        // Calculate total marks
        const totalMarks = numberOfQuestions;
        const passingMarks = Math.ceil(totalMarks * 0.4); // 40% passing

        // Create test in database
        const newTest = await AITest.create({
            title: generatedContent.title,
            description: generatedContent.description,
            subject,
            difficulty,
            duration: numberOfQuestions * 2, // 2 minutes per question
            questions: generatedContent.questions.map(q => ({
                ...q,
                marks: 1
            })),
            totalMarks,
            passingMarks,
            createdBy: 'AI'
        });

        res.json({
            success: true,
            message: 'Test generated successfully',
            test: newTest
        });

    } catch (error) {
        console.error('AI Test Generation Error:', error);
        res.json({ 
            success: false, 
            message: error.message || 'Failed to generate test'
        });
    }
};

// Get All Tests
export const getAllTests = async (req, res) => {
    try {
        const tests = await AITest.find({ isActive: true })
            .select('-questions.correctAnswer -questions.explanation')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            tests
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Test by ID
export const getTestById = async (req, res) => {
    try {
        const { testId } = req.params;

        const test = await AITest.findById(testId)
            .select('-questions.correctAnswer -questions.explanation');

        if (!test) {
            return res.json({ success: false, message: 'Test not found' });
        }

        res.json({
            success: true,
            test
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Submit Test
export const submitTest = async (req, res) => {
    try {
        if (!isAIConfigured()) {
            return res.json({
                success: false,
                message: 'AI service is currently under maintenance. Please try again later.',
                underMaintenance: true
            });
        }

        const userId = req.userId;
        const { testId, answers, timeTaken } = req.body;

        if (!testId || !answers || !timeTaken) {
            return res.json({ success: false, message: 'Please provide all required fields' });
        }

        const test = await AITest.findById(testId);
        if (!test) {
            return res.json({ success: false, message: 'Test not found' });
        }

        // Calculate score
        let score = 0;
        const processedAnswers = answers.map((answer, index) => {
            const question = test.questions[index];
            const isCorrect = answer === question.correctAnswer;
            const marksObtained = isCorrect ? question.marks : 0;
            score += marksObtained;

            return {
                questionIndex: index,
                selectedAnswer: answer,
                isCorrect,
                marksObtained
            };
        });

        const percentage = (score / test.totalMarks) * 100;
        const passed = score >= test.passingMarks;

        // Generate AI analysis
        const model = getGeminiClient();
        
        const analysisPrompt = `You are an expert CA educator providing constructive feedback to students.

Analyze this CA test performance:
- Subject: ${test.subject}
- Difficulty: ${test.difficulty}
- Score: ${score}/${test.totalMarks} (${percentage.toFixed(2)}%)
- Time Taken: ${Math.floor(timeTaken / 60)} minutes
- Questions Correct: ${processedAnswers.filter(a => a.isCorrect).length}/${test.questions.length}

Provide:
1. 3-5 key strengths
2. 3-5 areas for improvement
3. 5-7 specific recommendations
4. Overall feedback (2-3 sentences)

Format as a valid JSON object:
{
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "recommendations": ["rec1", "rec2", ...],
  "overallFeedback": "feedback text"
}

Return ONLY the JSON object, no additional text.`;

        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisResponse = await analysisResult.response;
        const analysisText = analysisResponse.text();
        
        // Extract JSON from response
        let analysisJsonText = analysisText.trim();
        if (analysisJsonText.startsWith('```json')) {
            analysisJsonText = analysisJsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (analysisJsonText.startsWith('```')) {
            analysisJsonText = analysisJsonText.replace(/```\n?/g, '');
        }
        
        const analysis = JSON.parse(analysisJsonText);

        // Save result
        const result = await TestResult.create({
            userId,
            testId,
            answers: processedAnswers,
            score,
            totalMarks: test.totalMarks,
            percentage,
            passed,
            timeTaken,
            analysis
        });

        // Update test attempt count
        test.attemptCount += 1;
        await test.save();

        res.json({
            success: true,
            message: 'Test submitted successfully',
            result: {
                ...result.toObject(),
                test: {
                    title: test.title,
                    subject: test.subject,
                    difficulty: test.difficulty
                }
            }
        });

    } catch (error) {
        console.error('Test Submission Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get Test Result
export const getTestResult = async (req, res) => {
    try {
        const { resultId } = req.params;
        const userId = req.userId;

        const result = await TestResult.findOne({ _id: resultId, userId })
            .populate('testId');

        if (!result) {
            return res.json({ success: false, message: 'Result not found' });
        }

        res.json({
            success: true,
            result
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get User Test History
export const getUserTestHistory = async (req, res) => {
    try {
        const userId = req.userId;

        const results = await TestResult.find({ userId })
            .populate('testId', 'title subject difficulty totalMarks')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            results
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// AI Chat
export const aiChat = async (req, res) => {
    try {
        if (!isAIConfigured()) {
            return res.json({
                success: false,
                message: 'AI service is currently under maintenance. Please try again later.',
                underMaintenance: true
            });
        }

        const userId = req.userId;
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.json({ success: false, message: 'Please provide message and session ID' });
        }

        const model = getGeminiClient();

        // Get or create chat history
        let chatHistory = await ChatHistory.findOne({ userId, sessionId });
        
        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId,
                sessionId,
                messages: [],
                topic: 'General CA Query'
            });
        }

        // Add user message to history
        chatHistory.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });

        // Prepare conversation history for Gemini
        const conversationHistory = chatHistory.messages.slice(-10).map(m => {
            return `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`;
        }).join('\n\n');

        const chatPrompt = `You are an expert CA (Chartered Accountant) tutor and mentor for Indian CA students. You help students with:
- Understanding CA concepts (Accounting, Auditing, Taxation, Corporate Law, etc.)
- Exam preparation strategies
- Study tips and time management
- Clarifying doubts on CA curriculum topics
- Career guidance for CA students

Always provide accurate, helpful, and encouraging responses. Reference Indian accounting standards (Ind AS) and CA curriculum when relevant.

Previous conversation:
${conversationHistory}

Provide a helpful, clear, and encouraging response to the student's latest question.`;

        // Get AI response
        const result = await model.generateContent(chatPrompt);
        const response = await result.response;
        const aiResponse = response.text();

        // Add AI response to history
        chatHistory.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
        });

        chatHistory.lastMessageAt = new Date();
        await chatHistory.save();

        res.json({
            success: true,
            message: aiResponse,
            sessionId
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get Chat History
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const { sessionId } = req.params;

        const chatHistory = await ChatHistory.findOne({ userId, sessionId });

        if (!chatHistory) {
            return res.json({
                success: true,
                messages: []
            });
        }

        res.json({
            success: true,
            messages: chatHistory.messages
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Chat Sessions
export const getAllChatSessions = async (req, res) => {
    try {
        const userId = req.userId;

        const sessions = await ChatHistory.find({ userId, isActive: true })
            .select('sessionId topic lastMessageAt messages')
            .sort({ lastMessageAt: -1 });

        const formattedSessions = sessions.map(session => ({
            sessionId: session.sessionId,
            topic: session.topic,
            lastMessageAt: session.lastMessageAt,
            messageCount: session.messages.length,
            lastMessage: session.messages[session.messages.length - 1]?.content.substring(0, 100) || ''
        }));

        res.json({
            success: true,
            sessions: formattedSessions
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
