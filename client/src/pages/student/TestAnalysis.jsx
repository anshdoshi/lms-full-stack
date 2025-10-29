import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const TestAnalysis = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/ai/result/${resultId}`, {
          headers: { token }
        });

        if (response.data.success) {
          setResult(response.data.result);
        } else {
          toast.error(response.data.message);
          navigate('/test-history');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load result');
        navigate('/test-history');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId, backendUrl, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/test-history')}
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Test History
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Test Analysis</h1>
          <p className="text-gray-600 mt-2">{result.test?.title}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${
              result.passed ? 'bg-green-100' : 'bg-red-100'
            } mb-4`}>
              <div className="text-center">
                <p className={`text-4xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.percentage.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Score</p>
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
              {result.passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
            </h2>
            <p className="text-gray-600 mt-2">
              {result.passed 
                ? 'You have passed this test!' 
                : 'Don\'t worry, practice makes perfect!'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Score</p>
              <p className="text-2xl font-bold text-gray-800">{result.score}/{result.totalMarks}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Correct</p>
              <p className="text-2xl font-bold text-green-600">
                {result.answers.filter(a => a.isCorrect).length}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Incorrect</p>
              <p className="text-2xl font-bold text-red-600">
                {result.answers.filter(a => !a.isCorrect).length}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Time Taken</p>
              <p className="text-2xl font-bold text-gray-800">{formatTime(result.timeTaken)}</p>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {result.analysis && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {result.analysis.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Areas to Improve</h3>
              </div>
              <ul className="space-y-2">
                {result.analysis.weaknesses?.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-orange-600 mt-1">!</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.analysis?.recommendations && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {result.analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="text-blue-600 font-bold mt-0.5">{index + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Overall Feedback */}
        {result.analysis?.overallFeedback && (
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-3">Overall Feedback</h3>
            <p className="text-white/90 leading-relaxed">{result.analysis.overallFeedback}</p>
          </div>
        )}

        {/* Detailed Answers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Detailed Answers</h3>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              {showAnswers ? 'Hide' : 'Show'} Answers
              <svg 
                className={`w-5 h-5 transition-transform ${showAnswers ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showAnswers && (
            <div className="space-y-6">
              {result.testId.questions.map((question, index) => {
                const answer = result.answers[index];
                return (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        answer.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-3">{question.questionText}</p>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => {
                            const isCorrect = optIndex === question.correctAnswer;
                            const isSelected = optIndex === answer.selectedAnswer;
                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrect
                                    ? 'border-green-500 bg-green-50'
                                    : isSelected
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrect && (
                                    <span className="text-green-600 font-bold">✓</span>
                                  )}
                                  {isSelected && !isCorrect && (
                                    <span className="text-red-600 font-bold">✗</span>
                                  )}
                                  <span className={isCorrect || isSelected ? 'font-medium' : ''}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                          <p className="text-sm text-blue-800">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/ai-tests')}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            Take Another Test
          </button>
          <button
            onClick={() => navigate('/ai-chat')}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Ask AI Tutor
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAnalysis;
