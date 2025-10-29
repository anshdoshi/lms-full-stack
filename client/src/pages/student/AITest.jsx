import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkAIStatus, generateTest, getAllTests, getTestHistory } from '../../utils/aiAPI';
import MaintenanceMode from '../../components/student/MaintenanceMode';

const AITest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [availableTests, setAvailableTests] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('generate'); // generate, available, history

  // Form state
  const [formData, setFormData] = useState({
    subject: 'Accounting',
    difficulty: 'Foundation',
    questionCount: 10,
  });

  const subjects = [
    'Accounting',
    'Taxation',
    'Auditing',
    'Corporate Law',
    'Financial Management',
    'Cost Accounting',
    'Economics',
    'Business Laws',
  ];

  const difficulties = ['Foundation', 'Intermediate', 'Final'];

  useEffect(() => {
    checkAIAvailability();
    fetchData();
  }, []);

  const checkAIAvailability = async () => {
    try {
      const response = await checkAIStatus();
      setAiConfigured(response.configured);
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiConfigured(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [testsResponse, historyResponse] = await Promise.all([
        getAllTests(),
        getTestHistory(),
      ]);

      if (testsResponse.success) {
        setAvailableTests(testsResponse.tests);
      }

      if (historyResponse.success) {
        setTestHistory(historyResponse.results);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateTest = async (e) => {
    e.preventDefault();

    if (!aiConfigured) {
      toast.error('AI service is currently under maintenance');
      return;
    }

    try {
      setGenerating(true);
      // Convert questionCount to numberOfQuestions for API
      const testData = {
        subject: formData.subject,
        difficulty: formData.difficulty,
        numberOfQuestions: parseInt(formData.questionCount)
      };
      
      const response = await generateTest(testData);

      if (response.success) {
        toast.success('Test generated successfully!');
        fetchData(); // Refresh the lists
        setActiveTab('available');
      } else {
        toast.error(response.message || 'Failed to generate test');
      }
    } catch (error) {
      if (error.underMaintenance) {
        toast.error('AI service is currently under maintenance');
      } else {
        toast.error(error.message || 'Failed to generate test');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/take-test/${testId}`);
  };

  const handleViewResult = (resultId) => {
    navigate(`/test-result/${resultId}`);
  };

  if (!aiConfigured) {
    return <MaintenanceMode feature="AI Test Generation" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Practice Tests
          </h1>
          <p className="text-gray-600">
            Generate personalized practice tests for CA examinations
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generate Test
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Tests ({availableTests.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Test History ({testHistory.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Generate Test Tab */}
          {activeTab === 'generate' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Generate New Test</h2>
              <form onSubmit={handleGenerateTest} className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, difficulty }))
                        }
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                          formData.difficulty === difficulty
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    name="questionCount"
                    value={formData.questionCount}
                    onChange={handleInputChange}
                    min="5"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Choose between 5 and 50 questions
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating Test...
                    </>
                  ) : (
                    'Generate Test'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Available Tests Tab */}
          {activeTab === 'available' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Available Tests</h2>
              {availableTests.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-600 mb-4">No tests available</p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Generate your first test →
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableTests.map((test) => (
                    <div
                      key={test._id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {test.title || test.subject}
                        </h3>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          {test.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {test.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{test.questions?.length || 0} Questions</span>
                        <span>{test.duration} mins</span>
                      </div>
                      <button
                        onClick={() => handleStartTest(test._id)}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition"
                      >
                        Start Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Test History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Test History</h2>
              {testHistory.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-600">No test history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testHistory.map((result) => (
                    <div
                      key={result._id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {result.testId?.title || result.testId?.subject || 'Test'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.percentage}%
                          </div>
                          <p className="text-sm text-gray-600">
                            {result.score}/{result.totalMarks}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                        <button
                          onClick={() => handleViewResult(result._id)}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITest;
