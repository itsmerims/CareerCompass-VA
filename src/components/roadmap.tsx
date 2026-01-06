'use client';

import type { RoadmapStep } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, FolderKanban, Send, CheckCircle2 } from "lucide-react";

interface RoadmapProps {
  roadmap: RoadmapStep[];
  careerPath: string;
  onRestart: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Learn: <BookOpen className="h-6 w-6" />,
  Practice: <Lightbulb className="h-6 w-6" />,
  Portfolio: <FolderKanban className="h-6 w-6" />,
  Apply: <Send className="h-6 w-6" />,
};

export function Roadmap({ roadmap, careerPath, onRestart }: RoadmapProps) {
  return (
    <Card className="w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl md:text-4xl">Your Roadmap to Becoming a {careerPath} VA</CardTitle>
        <CardDescription>Follow these steps to launch your new career.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2" />
          
          {roadmap.map((item, index) => (
            <div key={index} className="relative mb-8 last:mb-0 group" style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }} >
               <div className="absolute left-[-2rem] top-1.5 h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                {iconMap[item.step] || <CheckCircle2 className="h-6 w-6" />}
              </div>
              <div className="pl-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 150 + 200}ms`, animationFillMode: 'both' }}>
                <h3 className="text-xl font-semibold font-headline">{item.step}</h3>
                <p className="mt-1 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
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
