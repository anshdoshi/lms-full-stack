import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import TestCard from '../../components/student/TestCard';
import AIMaintenanceMode from '../../components/student/AIMaintenanceMode';

const AITests = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [aiConfigured, setAiConfigured] = useState(true);
  const [tests, setTests] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const [generateForm, setGenerateForm] = useState({
    subject: 'Accounting',
    difficulty: 'Foundation',
    numberOfQuestions: 10
  });

  const subjects = ['Accounting', 'Auditing', 'Taxation', 'Corporate Law', 'Financial Management', 'Cost Accounting', 'Economics', 'General'];
  const difficulties = ['Foundation', 'Intermediate', 'Final', 'Mixed'];

  useEffect(() => {
    const checkAIAndFetchTests = async () => {
      try {
        // Check AI status
        const statusRes = await axios.get(`${backendUrl}/api/ai/status`);
        if (!statusRes.data.configured) {
          setAiConfigured(false);
          setLoading(false);
          return;
        }

        // Fetch tests
        const testsRes = await axios.get(`${backendUrl}/api/ai/tests`, {
          headers: { token }
        });

        if (testsRes.data.success) {
          setTests(testsRes.data.tests);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAIAndFetchTests();
  }, [backendUrl, token]);

  const handleGenerateTest = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/ai/generate-test`,
        generateForm,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Test generated successfully!');
        setTests([response.data.test, ...tests]);
        setShowGenerateModal(false);
        setGenerateForm({
          subject: 'Accounting',
          difficulty: 'Foundation',
          numberOfQuestions: 10
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate test');
    } finally {
      setGenerating(false);
    }
  };

  const filteredTests = tests.filter(test => {
    const subjectMatch = filterSubject === 'All' || test.subject === filterSubject;
    const difficultyMatch = filterDifficulty === 'All' || test.difficulty === filterDifficulty;
    return subjectMatch && difficultyMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  if (!aiConfigured) {
    return <AIMaintenanceMode />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Practice Tests</h1>
              <p className="text-gray-600">Test your CA knowledge with AI-generated questions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/test-history')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Test History
              </button>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate Test
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
            >
              <option value="All">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
            >
              <option value="All">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tests Grid */}
        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map(test => (
              <TestCard key={test._id} test={test} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tests available</h3>
            <p className="text-gray-600 mb-6">Generate your first AI test to get started!</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Generate Test
            </button>
          </div>
        )}

        {/* Chat CTA */}
        <div className="mt-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Need Help with CA Topics?</h3>
          <p className="mb-6 text-white/90">Chat with our AI tutor for instant doubt resolution and study guidance</p>
          <button
            onClick={() => navigate('/ai-chat')}
            className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Generate Test Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Generate AI Test</h3>
            <form onSubmit={handleGenerateTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={generateForm.subject}
                  onChange={(e) => setGenerateForm({ ...generateForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  required
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={generateForm.difficulty}
                  onChange={(e) => setGenerateForm({ ...generateForm, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  required
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={generateForm.numberOfQuestions}
                  onChange={(e) => setGenerateForm({ ...generateForm, numberOfQuestions: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Between 10 and 50 questions</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  disabled={generating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITests;
