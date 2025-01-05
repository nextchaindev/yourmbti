import React from 'react';
import { MBTIType } from '../types/mbti';
import { Brain, Briefcase, Check, X } from 'lucide-react';

/**
 * TypeCard Component
 * Displays the MBTI test results in a visually appealing card format
 * Shows personality type, description, strengths, weaknesses, and recommended careers
 */

// Props for the TypeCard component
interface TypeCardProps {
  data?: MBTIType;     // MBTI type data to display
  userName?: string;    // Optional username to personalize the result
}

// TypeCard component that renders a detailed MBTI result card
export const TypeCard: React.FC<TypeCardProps> = ({ data, userName }) => {
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-xl text-gray-800">결과를 불러올 수 없습니다.</h1>
          <p className="text-gray-600 mt-2">다시 테스트를 시도해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {userName ? `${userName}님의 MBTI는` : ''} {data.type}
        </h1>
        <h2 className="text-xl text-gray-600 mt-2">{data.title}</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold">성격 특성</h3>
        </div>
        <p className="text-gray-700">{data.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold">강점</h3>
          </div>
          <ul className="list-disc list-inside text-gray-700">
            {data.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <X className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold">약점</h3>
          </div>
          <ul className="list-disc list-inside text-gray-700">
            {data.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">추천 직업</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.careers.map((career, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
            >
              {career}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};