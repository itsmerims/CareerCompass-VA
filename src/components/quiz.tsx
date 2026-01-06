'use client';

import { useState } from 'react';
import type { Question, AnswerWeight } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuizProps {
  questions: Question[];
  onComplete: (answers: AnswerWeight[]) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerWeight[]>([]);

  const handleAnswer = (answer: AnswerWeight) => {
    const newAnswers = [...selectedAnswers, answer];
    setSelectedAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl">Career Assessment</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
        <Progress value={progress} className="w-full mt-2 h-2" />
      </CardHeader>
      <CardContent>
        <p className="text-xl font-medium min-h-[6rem] flex items-center">{currentQuestion.text}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="h-auto whitespace-normal py-4 justify-start text-left hover:bg-primary/20 hover:border-primary"
              onClick={() => handleAnswer(answer.weights)}
            >
              {answer.text}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className='justify-end'>
         <p className="text-sm text-muted-foreground">Select the option that best describes you.</p>
      </CardFooter>
    </Card>
  );
}
