import { Answer } from '../types/question';
import { Question } from '../types/question';

export function calculateMBTI(answers: Answer[], questions: Question[]): string {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    const [first, second] = question.dimension.split('');
    if (answer.value === 0) {
      scores[first]++;
    } else {
      scores[second]++;
    }
  });

  // 각 차원별로 더 높은 점수를 받은 성향을 선택
  // 동점인 경우 두 번째 성향을 선택 (I, N, F, P)
  return [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P'
  ].join('');
}