
'use client';

import Link from 'next/link';
import { getSavedRoadmaps } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Lightbulb, Link as LinkIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import type { ResultProfile, Roadmap } from '@/lib/types';
import { useRouter } from 'next/navigation';

type SavedRoadmap = ResultProfile & { id: string; createdAt: string; roadmap?: Roadmap };

export default function SavedRoadmapsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setIsLoadingRoadmaps(true);
      getSavedRoadmaps(user.uid)
        .then(setRoadmaps)
        .finally(() => setIsLoadingRoadmaps(false));
    }
  }, [user]);

  if (loading || isLoadingRoadmaps) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl">My Saved Roadmaps</CardTitle>
            <CardDescription>
              {roadmaps.length > 0
                ? "Here are your previously saved assessment results and roadmaps."
                : "You don't have any saved roadmaps yet. Take an assessment to get started!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {roadmaps.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {roadmaps.map((result, index) => (
                  <AccordionItem value={`item-${index}`} key={result.id}>
                    <AccordionTrigger>
                      <div className="text-left">
                        <p className="font-semibold text-lg">{result.persona}</p>
                        <p className="text-sm text-muted-foreground">
                          Saved on {format(new Date(result.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {result.roadmap ? (
                        <>
                          <div>
                            <h4 className="text-md font-semibold flex items-center mb-3"><CheckCircle2 className="mr-2 h-5 w-5 text-primary" />Skill Checklist</h4>
                            <ul className="space-y-1.5 list-disc list-inside pl-2 text-muted-foreground text-sm">
                              {result.roadmap.skillChecklist.map((skill, i) => (
                                <li key={i}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold flex items-center mb-3"><Lightbulb className="mr-2 h-5 w-5 text-primary" />A Day in the Life</h4>
                            <p className="text-muted-foreground text-sm">{result.roadmap.dayInTheLife}</p>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold flex items-center mb-3"><LinkIcon className="mr-2 h-5 w-5 text-primary" />First Steps</h4>
                            <div className="space-y-2">
                              {result.roadmap.firstSteps.map((step, i) => (
                                <a
                                  key={i}
                                  href={step.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 rounded-md border text-sm hover:bg-accent/50 hover:border-primary transition-all group"
                                >
                                  <p className="font-medium text-primary-foreground group-hover:text-accent-foreground">{step.text}</p>
                                  <p className="text-xs text-muted-foreground truncate">{step.url}</p>
                                </a>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No roadmap was generated for this assessment.
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No results found.</p>
                <Button asChild>
                  <Link href="/">Take the Assessment</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
