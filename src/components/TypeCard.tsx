import React from 'react';
import { MBTIType } from '../types/mbti';
import { Brain, Briefcase, Check, X } from 'lucide-react';

interface TypeCardProps {
  data: {
    ko: {
      title: string;
      description: string;
      strengths: string[];
      weaknesses: string[];
      careers: string[];
    };
    en: {
      title: string;
      description: string;
      strengths: string[];
      weaknesses: string[];
      careers: string[];
    };
  };
  userName: string;
  language?: 'ko' | 'en';
}

export function TypeCard({ data, userName, language = 'ko' }: TypeCardProps) {
  if (!data || !data[language]) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h3 className="text-xl text-gray-800">
            {language === 'ko' ? '결과를 불러올 수 없습니다.' : 'Unable to load results.'}
          </h3>
          <p className="text-gray-600 mt-2">
            {language === 'ko' ? '다시 시도해주세요.' : 'Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  const content = data[language];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {userName ? `${userName}${language === 'ko' ? '님의' : "'s"} MBTI` : ''}
        </h1>
        <h2 className="text-xl text-gray-600 mt-2">{content.title}</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold">
            {language === 'ko' ? '성격 특성' : 'Personality Traits'}
          </h3>
        </div>
        <p className="text-gray-700">{content.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold">
              {language === 'ko' ? '강점' : 'Strengths'}
            </h3>
          </div>
          <ul className="list-disc list-inside text-gray-700">
            {content.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <X className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold">
              {language === 'ko' ? '약점' : 'Weaknesses'}
            </h3>
          </div>
          <ul className="list-disc list-inside text-gray-700">
            {content.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">
            {language === 'ko' ? '추천 직업' : 'Recommended Careers'}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.careers.map((career, index) => (
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
}