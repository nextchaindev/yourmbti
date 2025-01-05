/**
 * MBTI Calculator Utility
 * Calculates the MBTI type based on user's answers to the questionnaire
 */

import { Answer } from '../types/question';
import { Question } from '../types/question';

// Calculate MBTI type from answers and questions
export function calculateMBTI(answers: Answer[], questions: Question[]): string {
  // Initialize scores for each MBTI dimension
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  // Calculate scores based on answers
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    // Split dimension into its two components (e.g., 'EI' -> ['E', 'I'])
    const [first, second] = question.dimension.split('');
    if (answer.value === 0) {
      scores[first]++;  // Increment score for first preference
    } else {
      scores[second]++; // Increment score for second preference
    }
  });

  // Determine final type by comparing scores in each dimension
  // If scores are equal, default to the second preference (I, N, F, P)
  return [
    scores.E >= scores.I ? 'E' : 'I',  // Extraversion vs. Introversion
    scores.S >= scores.N ? 'S' : 'N',  // Sensing vs. Intuition
    scores.T >= scores.F ? 'T' : 'F',  // Thinking vs. Feeling
    scores.J >= scores.P ? 'J' : 'P'   // Judging vs. Perceiving
  ].join('');
}