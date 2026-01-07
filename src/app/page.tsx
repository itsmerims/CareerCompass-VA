
"use client";

import Image from "next/image";
import { useState, useMemo, startTransition } from "react";
import type { AnswerWeight, ResultProfile, QuizCategory } from "@/lib/types";
import { questions, totalPossibleScores } from "@/lib/questions";
import { CATEGORIES, CATEGORY_NAMES } from "@/lib/types";
import { generateVaRoadmap, type GenerateVaRoadmapOutput } from "@/ai/flows/generate-va-roadmap";
import { saveAssessmentResult } from "@/lib/actions";

import { Quiz } from "@/components/quiz";
import { Results } from "@/components/results";
import { Roadmap } from "@/components/roadmap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompassIcon } from "@/components/icons";
import placeholderData from "@/lib/placeholder-images.json";
import { useToast } from "@/hooks/use-toast";

type AppState = "intro" | "quiz" | "results" | "roadmap";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("intro");
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerWeight[]>([]);
  const [results, setResults] = useState<ResultProfile | null>(null);
  const [roadmap, setRoadmap] = useState<GenerateVaRoadmapOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const heroImage = useMemo(() => placeholderData.placeholderImages.find(img => img.id === 'hero'), []);

  const handleStart = () => {
    setAppState("quiz");
  };

  const handleRestart = () => {
    setSelectedAnswers([]);
    setResults(null);
    setRoadmap(null);
    setIsGenerating(false);
    setAppState("intro");
  };

  const handleQuizComplete = (answers: AnswerWeight[]) => {
    startTransition(() => {
      const scores: Record<QuizCategory, number> = {
        administrative: 0,
        creative: 0,
        technical: 0,
        analytical: 0,
        customerCentric: 0,
      };

      answers.forEach(answer => {
        for (const key in answer) {
          const category = key as QuizCategory;
          if (CATEGORIES.includes(category)) {
            scores[category] += answer[category] || 0;
          }
        }
      });
      
      const percentageScores: Record<QuizCategory, number> = { ...scores };
      let highestScore = -1;
      let recommendedPath: QuizCategory = 'administrative';

      (Object.keys(scores) as QuizCategory[]).forEach(category => {
        const percentage = Math.round((scores[category] / totalPossibleScores[category]) * 100);
        percentageScores[category] = percentage;

        if (percentage > highestScore) {
          highestScore = percentage;
          recommendedPath = category;
        }
      });

      const resultProfile: ResultProfile = {
        scores: percentageScores,
        recommendedPath: CATEGORY_NAMES[recommendedPath],
        persona: CATEGORY_NAMES[recommendedPath],
      };

      setResults(resultProfile);
      setAppState("results");
      
      // Save result to Firestore without blocking UI
      saveAssessmentResult("guest-user", { scores: resultProfile.scores, recommendedPath: resultProfile.recommendedPath }, resultProfile.persona)
        .then(response => {
          if (!response.success) {
            // Log a warning for developers if backend is not configured, but don't show a user-facing error.
            console.warn("Failed to save results (this is expected if the backend is not configured):", response.error);
          }
        })
        .catch(err => {
          // Show a toast for unexpected errors during the save process.
          console.error("An unexpected error occurred while saving results:", err);
          toast({
            variant: "destructive",
            title: "Save Failed",
            description: "An unexpected error occurred while saving your results.",
          });
        });
    });
  };
  
  const handleGenerateRoadmap = async () => {
    if (!results) return;

    setIsGenerating(true);
    try {
      const output = await generateVaRoadmap({ persona: results.persona });
      setRoadmap(output);
      setAppState("roadmap");
      
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was a problem generating your roadmap. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case "quiz":
        return <Quiz questions={questions} onComplete={handleQuizComplete} />;
      case "results":
        return results && <Results scores={results.scores} recommendedPath={results.recommendedPath} onGenerateRoadmap={handleGenerateRoadmap} isGenerating={isGenerating} />;
      case "roadmap":
        return roadmap && <Roadmap roadmap={roadmap} careerPath={results?.recommendedPath || ""} onRestart={handleRestart} />;
      case "intro":
      default:
        return (
          <Card className="w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="md:grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <CompassIcon className="h-12 w-12 text-primary" />
                <h1 className="font-headline text-4xl md:text-5xl font-bold mt-4">CareerCompass VA</h1>
                <p className="mt-4 text-lg text-muted-foreground">Unsure where to start in the world of Virtual Assistance? Take our quick assessment to discover the VA career path that best matches your skills and passions.</p>
                <div className="mt-8">
                  <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleStart}>
                    Start Assessment
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-auto">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                  />
                )}
              </div>
            </div>
          </Card>
        );
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        {renderContent()}
      </div>
    </main>
  );
}
