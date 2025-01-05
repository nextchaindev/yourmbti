/**
 * Question Selector Utility
 * Handles the selection and randomization of MBTI test questions
 */

import { Question } from '../types/question';
import { eiQuestions, snQuestions, tfQuestions, jpQuestions } from '../data/questionBank';

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array to avoid modifying the original
  const shuffled = [...array];
  // Iterate from last element to first
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Select random questions from each MBTI dimension
export function selectRandomQuestions(questionsPerDimension: number = 3): Question[] {
  // Select and shuffle questions from each MBTI dimension
  const selectedEI = shuffleArray(eiQuestions).slice(0, questionsPerDimension);    // E/I questions
  const selectedSN = shuffleArray(snQuestions).slice(0, questionsPerDimension);    // S/N questions
  const selectedTF = shuffleArray(tfQuestions).slice(0, questionsPerDimension);    // T/F questions
  const selectedJP = shuffleArray(jpQuestions).slice(0, questionsPerDimension);    // J/P questions

  // Combine all selected questions and shuffle again for random order
  return shuffleArray([...selectedEI, ...selectedSN, ...selectedTF, ...selectedJP]);
}
