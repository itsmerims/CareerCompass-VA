'use client';

import type { GenerateVaRoadmapOutput } from "@/ai/flows/generate-va-roadmap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Lightbulb, Link as LinkIcon } from "lucide-react";

interface RoadmapProps {
  roadmap: GenerateVaRoadmapOutput;
  careerPath: string;
  onRestart: () => void;
}

export function Roadmap({ roadmap, careerPath, onRestart }: RoadmapProps) {
  return (
    <Card className="w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl md:text-4xl">Your Roadmap to Becoming a {careerPath} VA</CardTitle>
        <CardDescription>Follow these steps to launch your new career.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold font-headline flex items-center mb-4"><CheckCircle2 className="mr-3 h-6 w-6 text-primary" />Skill Checklist</h3>
          <ul className="space-y-2 list-disc list-inside pl-2 text-muted-foreground">
            {roadmap.skillChecklist.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold font-headline flex items-center mb-4"><Lightbulb className="mr-3 h-6 w-6 text-primary" />A Day in the Life</h3>
          <p className="text-muted-foreground">{roadmap.dayInTheLife}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold font-headline flex items-center mb-4"><LinkIcon className="mr-3 h-6 w-6 text-primary" />First Steps</h3>
          <div className="space-y-3">
            {roadmap.firstSteps.map((step, index) => (
              <a 
                key={index}
                href={step.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block p-4 rounded-md border hover:bg-accent/50 hover:border-primary transition-all group"
              >
                <p className="font-medium text-primary-foreground group-hover:text-accent-foreground">{step.text}</p>
                <p className="text-sm text-muted-foreground truncate">{step.url}</p>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" variant="outline" className="w-full" onClick={onRestart}>
          Start Over
        </Button>
      </CardFooter>
    </Card>
  );
}
