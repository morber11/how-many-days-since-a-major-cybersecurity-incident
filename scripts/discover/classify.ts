import { generateText, Output } from "ai";
import { z } from "zod";
import type { Incident } from "../../src/data/incidents.ts";
import { INSTRUCTIONS } from "./instructions.ts";
import type { Provider } from "./providers.ts";
import type { Article, Candidate } from "./types.ts";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UPPER_SNAKE_CASE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

const candidateSchema = z.object({
    date: z.string(),
    title: z.string(),
    companyKey: z.string(),
    companyName: z.string(),
    description: z.string(),
    additionalNotes: z.string().optional(),
    sourceUrl: z.string(),
});

const outputSchema = z.object({ incidents: z.array(candidateSchema) });

function keepValidCandidates(candidates: Candidate[], articles: Article[]): Candidate[] {
    const articleUrls = new Set(articles.map((article) => article.url));
    const articleDates = articles.map((article) => article.date).sort();
    const earliestDate = articleDates[0];
    const latestDate = articleDates[articleDates.length - 1];

    return candidates.filter((candidate) => {
        const hasKnownSource = articleUrls.has(candidate.sourceUrl);
        const hasValidDate = DATE_PATTERN.test(candidate.date)
            && candidate.date >= earliestDate
            && candidate.date <= latestDate;
        const hasValidCompanyKey = UPPER_SNAKE_CASE_PATTERN.test(candidate.companyKey);

        const isValid = hasKnownSource && hasValidDate && hasValidCompanyKey;

        if (!isValid) {
            console.warn(`dropping invalid candidate: ${candidate.title}`);
        }

        return isValid;
    });
}

export async function classify(provider: Provider, articles: Article[], recent: Incident[], companies: Record<string, string>): Promise<Candidate[]> {
    const existingIncidents = recent.map(({ date, title, company }) => ({ date, title, company }));

    const { output } = await generateText({
        model: provider.model,
        instructions: INSTRUCTIONS,
        prompt: JSON.stringify({ existingIncidents, companies, articles }),
        output: Output.object({ schema: outputSchema }),
        providerOptions: provider.providerOptions,
    });

    return keepValidCandidates(output.incidents, articles);
}
