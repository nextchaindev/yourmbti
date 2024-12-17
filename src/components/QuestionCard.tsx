import React from 'react';
import { Question, Answer } from '../types/question';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: Answer) => void;
  currentAnswer?: 0 | 1;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  currentAnswer
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {question.text}
      </h3>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer({ questionId: question.id, value: index as 0 | 1 })}
            className={`w-full p-4 rounded-lg text-left transition-colors ${
              currentAnswer === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};