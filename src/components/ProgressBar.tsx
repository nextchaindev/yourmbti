import React from 'react';

/**
 * ProgressBar Component
 * Displays a visual progress indicator for the MBTI test
 * Shows how many questions have been answered out of the total
 */

interface ProgressBarProps {
  current: number;  // Current question number (1-based)
  total: number;    // Total number of questions
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div
        className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};