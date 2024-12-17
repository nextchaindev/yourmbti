import { Question } from '../types/question';
import { eiQuestions, snQuestions, tfQuestions, jpQuestions } from '../data/questionBank';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function selectRandomQuestions(questionsPerDimension: number = 3): Question[] {
  // 각 차원별로 무작위로 문제 선택
  const selectedEI = shuffleArray(eiQuestions).slice(0, questionsPerDimension);
  const selectedSN = shuffleArray(snQuestions).slice(0, questionsPerDimension);
  const selectedTF = shuffleArray(tfQuestions).slice(0, questionsPerDimension);
  const selectedJP = shuffleArray(jpQuestions).slice(0, questionsPerDimension);

  // 모든 선택된 문제를 합치고 섞기
  return shuffleArray([...selectedEI, ...selectedSN, ...selectedTF, ...selectedJP]);
}