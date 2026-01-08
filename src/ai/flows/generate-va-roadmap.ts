
'use server';

/**
 * @fileOverview Generates a detailed roadmap based on the user's VA persona.
 *
 * - generateVaRoadmap - A function that generates the roadmap.
 * - GenerateVaRoadmapInput - The input type for the generateVaRoadmap function.
 * - GenerateVaRoadmapOutput - The return type for the generateVaRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVaRoadmapInputSchema = z.object({
  persona: z.string().describe('The VA persona assigned to the user (e.g., The Optimizer, The Visionary).'),
});
export type GenerateVaRoadmapInput = z.infer<typeof GenerateVaRoadmapInputSchema>;

const GenerateVaRoadmapOutputSchema = z.object({
  skillChecklist: z.array(z.string()).describe('A checklist of specific skills to learn, tailored to the persona.'),
  dayInTheLife: z.string().describe("A brief, realistic snippet describing a typical day for this type of VA."),
  firstSteps: z.array(
    z.object({
      text: z.string().describe('The clickable text for the resource link.'),
      url: z.string().url().describe('A real, valid URL for a helpful article, tool, or course.'),
    })
  ).describe('A list of 3 actionable first-step links for the user to explore.'),
});
export type GenerateVaRoadmapOutput = z.infer<typeof GenerateVaRoadmapOutputSchema>;

export async function generateVaRoadmap(input: GenerateVaRoadmapInput): Promise<GenerateVaRoadmapOutput> {
  return generateVaRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVaRoadmapPrompt',
  input: {schema: GenerateVaRoadmapInputSchema},
  output: {schema: GenerateVaRoadmapOutputSchema},
  prompt: `You are a career coach specializing in virtual assistant careers. A user has been assigned a VA persona based on a quiz. Generate a detailed, practical roadmap for them.

VA Persona: {{{persona}}}

Based on this persona, provide the following:
1.  **Skill Checklist:** A list of 5-7 specific, learnable skills. (e.g., "Learn Pivot Tables," "Master Canva Layers").
2.  **Day in the Life:** A short, engaging paragraph (2-3 sentences) describing a typical workday to set realistic expectations.
3.  **First Steps:** Exactly three actionable resource links. IMPORTANT: Use a search engine to find real, valid URLs. Do not make up URLs. These should be for well-known tools (like Asana, Canva), popular learning platforms (like Udemy, Coursera), or insightful articles from reputable sources.`,
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
