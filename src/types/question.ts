/**
 * Question Type Definitions
 * Contains type definitions for MBTI test questions and answers
 */

// Interface defining the structure of a test question
export type Question = {
  id: number;                            // Unique identifier for the question
  text: string;                          // The question text
  dimension: 'EI' | 'SN' | 'TF' | 'JP';  // MBTI dimension the question tests for
  options: [string, string];             // Array of two answer options
};

// Interface defining the structure of a user's answer
export type Answer = {
  questionId: number;    // ID of the question being answered
  value: 0 | 1;         // 0 for first option, 1 for second option
};