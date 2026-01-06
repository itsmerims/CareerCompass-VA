'use client';

import { CATEGORY_NAMES, QuizCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ResultsProps {
  scores: Record<QuizCategory, number>;
  recommendedPath: string;
  onGenerateRoadmap: () => void;
  isGenerating: boolean;
}

export function Results({ scores, recommendedPath, onGenerateRoadmap, isGenerating }: ResultsProps) {
  const sortedScores = Object.entries(scores)
    .map(([category, score]) => ({ category: category as QuizCategory, score }))
    .sort((a, b) => b.score - a.score);

  return (
    <Card className="w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl md:text-4xl">Your VA Profile</CardTitle>
        <CardDescription>Based on your answers, here is your skill breakdown.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          {sortedScores.map(({ category, score }) => (
            <div key={category} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-medium text-lg">{CATEGORY_NAMES[category]}</span>
                <span className="font-semibold text-lg text-primary">{score}%</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>
          ))}
        </div>
        <div className="text-center bg-primary/20 p-6 rounded-lg">
          <p className="text-muted-foreground text-lg">Your recommended path is</p>
          <h3 className="text-3xl font-bold font-headline text-primary-foreground mt-1">{recommendedPath} VA</h3>
          <p className="mt-3 max-w-md mx-auto text-muted-foreground">
            This path aligns with your strongest skills. Let's create a personalized plan to help you get started.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={onGenerateRoadmap} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate My Roadmap'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
