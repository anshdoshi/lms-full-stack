import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  checkAIStatus,
  sendChatMessage,
  getChatHistory,
  getChatSessions,
} from '../../utils/aiAPI';
import MaintenanceMode from '../../components/student/MaintenanceMode';

const AIChat = () => {
  const [loading, setLoading] = useState(true);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkAIAvailability();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      fetchChatHistory(currentSession);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAIAvailability = async () => {
    try {
      const response = await checkAIStatus();
      setAiConfigured(response.configured);
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiConfigured(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getChatSessions();

      if (response.success) {
        setSessions(response.sessions);
        if (response.sessions.length > 0 && !currentSession) {
          setCurrentSession(response.sessions[0].sessionId);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (sessionId) => {
    try {
      const response = await getChatHistory(sessionId);

      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handleNewSession = () => {
    setCurrentSession(null);
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !aiConfigured) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to UI immediately
    const tempUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      setSending(true);

      const response = await sendChatMessage({
        message: userMessage,
        sessionId: currentSession || `session-${Date.now()}`,
      });

      if (response.success) {
        // Add AI response to messages
        const aiMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Update session if it's a new one
        if (!currentSession && response.sessionId) {
          setCurrentSession(response.sessionId);
          fetchSessions(); // Refresh sessions list
        }
      } else {
        toast.error(response.message || 'Failed to send message');
        // Remove the temporary message on error
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      if (error.underMaintenance) {
        toast.error('AI service is currently under maintenance');
      } else {
        toast.error(error.message || 'Failed to send message');
      }
      // Remove the temporary message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!aiConfigured) {
    return <MaintenanceMode feature="AI Chat Tutor" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewSession}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Chat History
          </h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500">No chat history yet</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.sessionId}
                  onClick={() => setCurrentSession(session.sessionId)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    currentSession === session.sessionId
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.topic || 'Chat Session'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {session.messageCount} messages
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(session.lastMessageAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Tutor</h1>
              <p className="text-sm text-gray-600">
                Ask me anything about CA subjects
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to AI Tutor!
                </h3>
                <p className="text-gray-600 mb-6">
                  I'm here to help you with your CA studies. Ask me anything
                  about Accounting, Taxation, Auditing, and more!
                </p>
                <div className="grid grid-cols-1 gap-2 text-left">
                  <button
                    onClick={() =>
                      setInputMessage('Explain the concept of double entry bookkeeping')
                    }
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition"
                  >
                    💡 Explain double entry bookkeeping
                  </button>
                  <button
                    onClick={() =>
                      setInputMessage('What are the types of audits?')
                    }
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition"
                  >
                    📚 Types of audits
                  </button>
                  <button
                    onClick={() =>
                      setInputMessage('Difference between direct and indirect tax')
                    }
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition"
                  >
                    🎯 Direct vs Indirect tax
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-200'
                    } rounded-lg p-4 shadow-sm`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user'
                          ? 'text-primary-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about CA subjects..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI Tutor can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
