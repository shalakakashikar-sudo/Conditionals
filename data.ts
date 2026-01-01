
import { LESSONS } from './data/lessons.ts';
import { ZERO_QUESTIONS } from './data/zero.ts';
import { FIRST_QUESTIONS } from './data/first.ts';
import { SECOND_QUESTIONS } from './data/second.ts';
import { THIRD_QUESTIONS } from './data/third.ts';
import { MIXED1_QUESTIONS } from './data/mixed1.ts';
import { MIXED2_QUESTIONS } from './data/mixed2.ts';
import { OVERALL_QUESTIONS } from './data/overall.ts';
import { Question } from './types.ts';

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
