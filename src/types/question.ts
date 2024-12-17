export type Question = {
  id: number;
  text: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  options: [string, string];
};

export type Answer = {
  questionId: number;
  value: 0 | 1;  // 0 for first option, 1 for second option
};