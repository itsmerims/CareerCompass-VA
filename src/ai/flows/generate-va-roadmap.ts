'use server';

/**
 * @fileOverview Generates a 4-step roadmap (Learn, Practice, Portfolio, Apply) tailored to the user's recommended VA career path.
 *
 * - generateVaRoadmap - A function that generates the roadmap.
 * - GenerateVaRoadmapInput - The input type for the generateVaRoadmap function.
 * - GenerateVaRoadmapOutput - The return type for the generateVaRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVaRoadmapInputSchema = z.object({
  careerPath: z.string().describe('The recommended VA career path for the user.'),
});
export type GenerateVaRoadmapInput = z.infer<typeof GenerateVaRoadmapInputSchema>;

const GenerateVaRoadmapOutputSchema = z.object({
  roadmap: z.array(
    z.object({
      step: z.string().describe('The name of the step in the roadmap.'),
      description: z.string().describe('The description of the step.'),
    })
  ).describe('A 4-step roadmap for the user to follow.'),
});
export type GenerateVaRoadmapOutput = z.infer<typeof GenerateVaRoadmapOutputSchema>;

export async function generateVaRoadmap(input: GenerateVaRoadmapInput): Promise<GenerateVaRoadmapOutput> {
  return generateVaRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVaRoadmapPrompt',
  input: {schema: GenerateVaRoadmapInputSchema},
  output: {schema: GenerateVaRoadmapOutputSchema},
  prompt: `You are a career coach specializing in virtual assistant careers. Generate a 4-step roadmap (Learn, Practice, Portfolio, Apply) tailored to the user's recommended VA career path, so they can understand how to get started.

Career Path: {{{careerPath}}}

Roadmap:`, 
});

const generateVaRoadmapFlow = ai.defineFlow(
  {
    name: 'generateVaRoadmapFlow',
    inputSchema: GenerateVaRoadmapInputSchema,
    outputSchema: GenerateVaRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
