import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const TestHistory = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filterSubject, setFilterSubject] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/ai/test-history`, {
          headers: { token }
        });

        if (response.data.success) {
          setResults(response.data.results);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [backendUrl, token]);

  const subjects = ['All', ...new Set(results.map(r => r.testId?.subject).filter(Boolean))];

  const filteredResults = filterSubject === 'All' 
    ? results 
    : results.filter(r => r.testId?.subject === filterSubject);

  const getStats = () => {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const avgScore = results.length > 0 
      ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1)
      : 0;
    
    return { totalTests, passedTests, avgScore };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/ai-tests')}
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tests
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Test History</h1>
          <p className="text-gray-600">Track your progress and review past performances</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tests Passed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.passedTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-800">{stats.avgScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        {subjects.length > 1 && (
          <div className="mb-6">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        )}

        {/* Results List */}
        {filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div
                key={result._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {result.testId?.title || 'Test'}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {result.testId?.subject}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
                          {result.testId?.difficulty}
                        </span>
                        <span className="text-gray-600">
                          {new Date(result.completedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Score */}
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${
                          result.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.percentage.toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.score}/{result.totalMarks}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div>
                        <span className={`px-4 py-2 rounded-full font-medium ${
                          result.passed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/test-analysis/${result._id}`)}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                      >
                        View Analysis
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Correct</p>
                      <p className="text-lg font-bold text-green-600">
                        {result.answers.filter(a => a.isCorrect).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Incorrect</p>
                      <p className="text-lg font-bold text-red-600">
                        {result.answers.filter(a => !a.isCorrect).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time Taken</p>
                      <p className="text-lg font-bold text-gray-800">
                        {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No test history yet</h3>
            <p className="text-gray-600 mb-6">Take your first test to start tracking your progress!</p>
            <button
              onClick={() => navigate('/ai-tests')}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Browse Tests
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistory;
