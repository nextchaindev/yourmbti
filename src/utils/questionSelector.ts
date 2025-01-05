/**
 * Question Selector Utility
 * Handles the selection and randomization of MBTI test questions
 */

import { Question } from '../types/question';
import { eiQuestions, snQuestions, tfQuestions, jpQuestions } from '../data/questionBank';

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Select random questions from each MBTI dimension
export function selectRandomQuestions(questionsPerDimension: number = 3): Question[] {
  // Select random questions from each dimension
  const selectedEI = shuffleArray(eiQuestions).slice(0, questionsPerDimension);
  const selectedSN = shuffleArray(snQuestions).slice(0, questionsPerDimension);
  const selectedTF = shuffleArray(tfQuestions).slice(0, questionsPerDimension);
  const selectedJP = shuffleArray(jpQuestions).slice(0, questionsPerDimension);

  // Combine and shuffle all selected questions
  return shuffleArray([...selectedEI, ...selectedSN, ...selectedTF, ...selectedJP]);
}
