/**
 * MBTI Calculator Utility
 * Calculates the MBTI type based on user's answers to the questionnaire
 */

import { Answer } from '../types/question';
import { Question } from '../types/question';

// Calculate MBTI type from answers and questions
export function calculateMBTI(answers: Answer[], questions: Question[]): string {
  // Initialize scores for each MBTI dimension with zero values
  const scores = {
    E: 0, I: 0,  // Extraversion vs Introversion
    S: 0, N: 0,  // Sensing vs Intuition
    T: 0, F: 0,  // Thinking vs Feeling
    J: 0, P: 0   // Judging vs Perceiving
  };

  // Process each answer to calculate dimension scores
  answers.forEach(answer => {
    // Find the corresponding question for this answer
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;  // Skip if question not found

    // Extract the two personality preferences from the dimension (e.g., 'EI' -> ['E', 'I'])
    const [first, second] = question.dimension.split('');
    
    // Increment score based on the answer value
    // answer.value = 0 means first preference was chosen
    // answer.value = 1 means second preference was chosen
    if (answer.value === 0) {
      scores[first]++;  // Increment score for first preference
    } else {
      scores[second]++; // Increment score for second preference
    }
  });

  // Determine final type by comparing scores in each dimension
  // For each dimension, compare the scores of opposing preferences
  // If scores are equal, default to the second preference (I, N, F, P)
  return [
    scores.E >= scores.I ? 'E' : 'I',  // Choose E if E score >= I score, otherwise I
    scores.S >= scores.N ? 'S' : 'N',  // Choose S if S score >= N score, otherwise N
    scores.T >= scores.F ? 'T' : 'F',  // Choose T if T score >= F score, otherwise F
    scores.J >= scores.P ? 'J' : 'P'   // Choose J if J score >= P score, otherwise P
  ].join('');
}