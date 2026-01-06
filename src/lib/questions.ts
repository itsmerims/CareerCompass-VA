import type { Question, QuizCategory } from './types';

export const questions: Question[] = [
  {
    id: 1,
    text: "When you approach a complex project, what's your first step?",
    answers: [
      { text: 'Break it down into a detailed to-do list and set deadlines.', weights: { administrative: 5, analytical: 2 } },
      { text: 'Think about the visual feel and brand identity.', weights: { creative: 5 } },
      { text: 'Identify the best software or tools for the job.', weights: { technical: 5 } },
      { text: "Imagine the end-user's experience and how to improve it.", weights: { customerCentric: 5, analytical: 1 } },
    ],
  },
  {
    id: 2,
    text: 'Which of these tasks sounds most appealing?',
    answers: [
      { text: 'Organizing a messy inbox and calendar.', weights: { administrative: 5 } },
      { text: 'Designing a social media graphic.', weights: { creative: 5 } },
      { text: 'Troubleshooting a website issue.', weights: { technical: 5 } },
      { text: 'Analyzing data to find trends.', weights: { analytical: 5 } },
    ],
  },
  {
    id: 3,
    text: 'A client is unhappy. How do you respond?',
    answers: [
      { text: 'Listen patiently, empathize with their frustration, and find a solution.', weights: { customerCentric: 5 } },
      { text: 'Review the project scope and past communications to identify the issue.', weights: { administrative: 2, analytical: 3 } },
      { text: 'Offer a creative solution or alternative to fix the problem.', weights: { creative: 3 } },
      { text: 'Check for technical errors or system problems that might be the cause.', weights: { technical: 3 } },
    ],
  },
  {
    id: 4,
    text: 'What kind of software are you most comfortable with?',
    answers: [
      { text: 'Project management tools like Asana or Trello.', weights: { administrative: 5 } },
      { text: 'Design software like Canva or Adobe Photoshop.', weights: { creative: 5 } },
      { text: 'Website builders like WordPress or Squarespace.', weights: { technical: 5 } },
      { text: 'Spreadsheet tools like Excel or Google Sheets for data analysis.', weights: { analytical: 5 } },
    ],
  },
  {
    id: 5,
    text: 'When learning something new, you prefer to:',
    answers: [
      { text: 'Follow a structured, step-by-step guide.', weights: { administrative: 3, analytical: 1 } },
      { text: 'Experiment and play around with visual outcomes.', weights: { creative: 4 } },
      { text: 'Read the technical documentation and understand how it works.', weights: { technical: 5 } },
      { text: 'Understand the "why" and the data behind it.', weights: { analytical: 5 } },
    ],
  },
  {
    id: 6,
    text: 'What makes you feel most accomplished at the end of the day?',
    answers: [
      { text: 'Clearing your task list and achieving "inbox zero".', weights: { administrative: 5 } },
      { text: 'Creating something beautiful and visually appealing.', weights: { creative: 5 } },
      { text: 'Solving a tricky technical problem.', weights: { technical: 5 } },
      { text: 'Helping a customer solve their problem and leaving them happy.', weights: { customerCentric: 5 } },
    ],
  },
  {
    id: 7,
    text: 'Which part of a business blog are you most interested in?',
    answers: [
      { text: 'The content calendar and publishing schedule.', weights: { administrative: 5 } },
      { text: 'The blog post graphics and overall layout.', weights: { creative: 5 } },
      { text: 'The SEO optimization and backend plugins.', weights: { technical: 5 } },
      { text: 'The analytics: which posts get the most traffic and why.', weights: { analytical: 5 } },
    ],
  },
  {
    id: 8,
    text: 'You need to present a monthly report. What format do you choose?',
    answers: [
      { text: 'A clear, concise document with bullet points.', weights: { administrative: 4 } },
      { text: 'An engaging and well-designed slideshow.', weights: { creative: 4, customerCentric: 1 } },
      { text: 'An interactive dashboard with live data.', weights: { technical: 4, analytical: 2 } },
      { text: 'A detailed spreadsheet with charts and pivot tables.', weights: { analytical: 5 } },
    ],
  },
  {
    id: 9,
    text: 'When faced with a repetitive task, you:',
    answers: [
      { text: 'Create a checklist to ensure consistency and accuracy every time.', weights: { administrative: 5 } },
      { text: 'Find ways to make it more visually interesting each time.', weights: { creative: 3 } },
      { text: 'Look for a way to automate it with a script or tool.', weights: { technical: 5, analytical: 1 } },
      { text: 'Focus on doing it perfectly to ensure the best outcome for the client.', weights: { customerCentric: 4 } },
    ],
  },
  {
    id: 10,
    text: 'Pick a work-related superpower:',
    answers: [
      { text: 'The ability to be in ten places at once, managing all the details.', weights:      { administrative: 5, customerCentric: 2 } },
      { text: 'The ability to make anything look stunning and professional.', weights: { creative: 5 } },
      { text: 'The ability to speak with computers and fix any bug.', weights: { technical: 5 } },
      { text: 'The ability to see future trends in data patterns.', weights: { analytical: 5 } },
    ],
  },
  {
    id: 11,
    text: "Do you prefer working in a quiet, focused environment or a fast-paced, interactive one?",
    answers: [
        { text: "Quiet and focused, where I can concentrate on data or writing.", weights: { analytical: 5, administrative: 3 } },
        { text: "Fast-paced and interactive, like social media or customer support.", weights: { creative: 4, customerCentric: 5 } },
        { text: "A mix of both is ideal.", weights: { technical: 3, administrative: 2 } },
        { text: "I'm adaptable to either environment.", weights: { } },
    ]
  },
  {
    id: 12,
    text: "Which of these have you opened in the last 30 days?",
    answers: [
        { text: "Excel or Google Sheets.", weights: { analytical: 5, administrative: 2 } },
        { text: "Canva or another design tool.", weights: { creative: 5 } },
        { text: "ChatGPT or another AI assistant.", weights: { technical: 3, creative: 2 } },
        { text: "None of the above.", weights: { } },
    ]
  },
  {
    id: 13,
    text: "How do you react when a client gives you vague instructions?",
    answers: [
        { text: "I ask for a follow-up meeting to clarify details.", weights: { customerCentric: 5, administrative: 3 } },
        { text: "I research examples and present a few options.", weights: { creative: 4, analytical: 3 } },
        { text: "I try to build a first version and get feedback.", weights: { technical: 4, creative: 2 } },
        { text: "I wait for them to provide more information.", weights: { administrative: 1 } },
    ]
  }
];


export const totalPossibleScores: Record<QuizCategory, number> = questions.reduce(
  (totals, question) => {
    const questionMaxScores: Record<QuizCategory, number> = {
      administrative: 0,
      creative: 0,
      technical: 0,
      analytical: 0,
      customerCentric: 0,
    };

    question.answers.forEach(answer => {
      for (const category in answer.weights) {
        questionMaxScores[category as QuizCategory] = Math.max(
          questionMaxScores[category as QuizCategory],
          answer.weights[category as QuizCategory] || 0
        );
      }
    });

    for (const category in questionMaxScores) {
      totals[category as QuizCategory] += questionMaxScores[category as QuizCategory];
    }
    
    return totals;
  },
  {
    administrative: 0,
    creative: 0,
    technical: 0,
    analytical: 0,
    customerCentric: 0,
  }
);
