import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const caseStudies = defineCollection({
	loader: glob({ base: "./src/content/case-studies", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string(),
		category: z.string(),
		description: z.string(),
		technologies: z.array(z.string()),
		image: z.string().optional(),
		skills: z.array(z.object({ name: z.string(), evidence: z.string() })),
	}),
});

export const collections = { caseStudies };
