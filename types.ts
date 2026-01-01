
export type ConditionalType = 'Master Guide' | 'Zero' | 'First' | 'Second' | 'Third' | 'Mixed Conditional 1' | 'Mixed Conditional 2' | 'Overall';

export interface LessonExample {
  label: string;
  text: string;
}

export interface Formula {
  ifPart: string;
  resultPart: string;
}

export interface LessonContent {
  type: ConditionalType;
  vibe: string;
  realityLevel: string;
  timeline: string;
  meaning: string;
  formula: Formula;
  examples: LessonExample[];
  proTips?: string[];
  commonMistakes?: string[];
  nuances?: { title: string; text: string }[];
}

export type QuestionType = 'multiple-choice' | 'fill-blank' | 'boolean';

export interface Question {
  id: number;
  type: ConditionalType;
  questionType: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  options?: string[]; // Optional for fill-blank
  correctAnswer: number | string; // Index for MC/Boolean, String for Fill-blank
  explanation: string;
}
