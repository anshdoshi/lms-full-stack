import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestCard = ({ test }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Foundation':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Final':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      'Accounting': '📊',
      'Auditing': '🔍',
      'Taxation': '💰',
      'Corporate Law': '⚖️',
      'Financial Management': '📈',
      'Cost Accounting': '💵',
      'Economics': '🌐',
      'General': '📚'
    };
    return icons[subject] || '📚';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{getSubjectIcon(test.subject)}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(test.difficulty)}`}>
            {test.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {test.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {test.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Questions</p>
            <p className="text-lg font-bold text-gray-800">{test.questions?.length || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-lg font-bold text-gray-800">{test.duration} min</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Marks</p>
            <p className="text-lg font-bold text-gray-800">{test.totalMarks}</p>
          </div>
        </div>

        {/* Subject Badge */}
        <div className="mb-4">
          <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            {test.subject}
          </span>
        </div>

        {/* Attempts */}
        {test.attemptCount > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            {test.attemptCount} student{test.attemptCount !== 1 ? 's' : ''} attempted
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={() => navigate(`/ai-test/${test._id}`)}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 transition font-medium"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default TestCard;
