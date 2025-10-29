import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTestResult } from '../../utils/aiAPI';

const TestResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await getTestResult(resultId);

      if (response.success) {
        setResult(response.result);
      } else {
        toast.error(response.message || 'Failed to load result');
        navigate('/ai-test');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load result');
      navigate('/ai-test');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ai-test')}
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 flex items-center"
          >
            ← Back to Tests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="text-center">
            <div className="mb-4">
              <div className="text-6xl font-bold mb-2">{result.percentage.toFixed(2)}%</div>
              <div className="text-xl opacity-90">
                {result.score} out of {result.totalMarks} correct
              </div>
            </div>
            <div className="inline-block px-6 py-2 bg-white bg-opacity-20 rounded-full text-lg font-semibold">
              {getGrade(result.percentage)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white border-opacity-20">
            <div className="text-center">
              <div className="text-2xl font-bold">{result.score}</div>
              <div className="text-sm opacity-90">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {result.totalMarks - result.score}
              </div>
              <div className="text-sm opacity-90">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {result.answers.filter((a) => a.selectedAnswer === -1 || a.selectedAnswer === undefined).length}
              </div>
              <div className="text-sm opacity-90">Unanswered</div>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Subject</p>
              <p className="font-semibold text-gray-900">
                {result.testId?.subject || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Difficulty</p>
              <p className="font-semibold text-gray-900">
                {result.testId?.difficulty || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed On</p>
              <p className="font-semibold text-gray-900">
                {new Date(result.completedAt || result.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Taken</p>
              <p className="font-semibold text-gray-900">
                {result.timeTaken
                  ? `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {result.analysis && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg
                className="w-6 h-6 text-primary-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              AI Analysis
            </h2>

            {/* Overall Feedback */}
            {result.analysis.overallFeedback && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Overall Feedback
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {result.analysis.overallFeedback}
                </p>
              </div>
            )}

            {/* Strengths */}
            {result.analysis.strengths && result.analysis.strengths.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {result.analysis.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 bg-green-50 p-3 rounded-lg"
                    >
                      <span className="text-green-600 mr-2 mt-0.5">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {result.analysis.weaknesses && result.analysis.weaknesses.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="text-red-600 mr-2">✗</span>
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.analysis.weaknesses.map((weakness, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 bg-red-50 p-3 rounded-lg"
                    >
                      <span className="text-red-600 mr-2 mt-0.5">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.analysis.recommendations &&
              result.analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="text-blue-600 mr-2">→</span>
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.analysis.recommendations.map((recommendation, index) => (
                      <li
                        key={index}
                        className="flex items-start text-gray-700 bg-blue-50 p-3 rounded-lg"
                      >
                        <span className="text-blue-600 mr-2 mt-0.5">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Question Review */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Question Review</h2>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {showAnswers ? 'Hide Answers' : 'Show Answers'}
            </button>
          </div>

          {showAnswers && (
            <div className="space-y-6">
              {result.testId?.questions.map((question, index) => {
                const userAnswer = result.answers[index];
                const isCorrect = userAnswer?.isCorrect;
                const wasAnswered = userAnswer?.selectedAnswer !== -1 && userAnswer?.selectedAnswer !== undefined;

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50'
                        : wasAnswered
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Question {index + 1}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCorrect
                            ? 'bg-green-100 text-green-700'
                            : wasAnswered
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isCorrect
                          ? 'Correct'
                          : wasAnswered
                          ? 'Incorrect'
                          : 'Not Answered'}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-4">{question.questionText || question.question}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer =
                          userAnswer?.selectedAnswer === optIndex;
                        const isCorrectAnswer =
                          question.correctAnswer === optIndex;

                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border ${
                              isCorrectAnswer
                                ? 'border-green-500 bg-green-100'
                                : isUserAnswer
                                ? 'border-red-500 bg-red-100'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center">
                              {isCorrectAnswer && (
                                <span className="text-green-600 mr-2">✓</span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="text-red-600 mr-2">✗</span>
                              )}
                              <span
                                className={
                                  isCorrectAnswer || isUserAnswer
                                    ? 'font-medium'
                                    : ''
                                }
                              >
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Explanation:
                        </p>
                        <p className="text-sm text-blue-800">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/ai-test')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Take Another Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
