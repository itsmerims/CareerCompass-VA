export const CATEGORIES = [
  'administrative',
  'creative',
  'technical',
  'analytical',
  'customerCentric',
] as const;

export type QuizCategory = typeof CATEGORIES[number];

export const CATEGORY_NAMES: Record<QuizCategory, string> = {
  administrative: 'The Optimizer', // Admin
  creative: 'The Visionary', // Creative
  technical: 'The Architect', // Tech
  analytical: 'The Storyteller', // Content/Analytical
  customerCentric: 'The Reliable', // Customer Support
};

export type AnswerWeight = Partial<Record<QuizCategory, number>>;

export type Answer = {
  text: string;
  weights: AnswerWeight;
};

export type Question = {
  id: number;
  text: string;
  answers: Answer[];
};

export type ResultProfile = {
  scores: Record<QuizCategory, number>;
  recommendedPath: string;
  persona: string;
};

export type RoadmapStep = {
  step: string;
  description: string;
};

export type Roadmap = {
  skillChecklist: string[];
  dayInTheLife: string;
  firstSteps: { text: string; url: string }[];
};
