
import { LESSONS } from './data/lessons';
import { ZERO_QUESTIONS } from './data/zero';
import { FIRST_QUESTIONS } from './data/first';
import { SECOND_QUESTIONS } from './data/second';
import { THIRD_QUESTIONS } from './data/third';
import { MIXED1_QUESTIONS } from './data/mixed1';
import { MIXED2_QUESTIONS } from './data/mixed2';
import { OVERALL_QUESTIONS } from './data/overall';
import { Question } from './types';

export { LESSONS };

// Aggregated QUESTIONS array for easy access
export const QUESTIONS: Question[] = [
  ...ZERO_QUESTIONS,
  ...FIRST_QUESTIONS,
  ...SECOND_QUESTIONS,
  ...THIRD_QUESTIONS,
  ...MIXED1_QUESTIONS,
  ...MIXED2_QUESTIONS,
  ...OVERALL_QUESTIONS
];
