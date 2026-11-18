import { generateText, Output } from "ai";
import { z } from "zod";
import { splitIntoBatches } from "../batching/batching.ts";
import { INSTRUCTIONS } from "./instructions.ts";
import type { Provider } from "./providers.ts";
import type { Article, Candidate } from "./types.ts";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UPPER_SNAKE_CASE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

const MAX_RETRIES = 6;

interface KnownIncident {
    date: string;
    title: string;
    company?: string;
}

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

function buildPrompt(articles: Article[], recent: KnownIncident[], companies: Record<string, string>): string {
    const existingIncidents = recent.map(({ date, title, company }) => ({ date, title, company }));

    return JSON.stringify({ existingIncidents, companies, articles });
}

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export async function classify(provider: Provider, articles: Article[], recent: KnownIncident[], companies: Record<string, string>): Promise<Candidate[]> {
    const { output } = await generateText({
        model: provider.model,
        instructions: INSTRUCTIONS,
        prompt: buildPrompt(articles, recent, companies),
        output: Output.object({ schema: outputSchema }),
        providerOptions: provider.providerOptions,
        maxRetries: MAX_RETRIES,
    });

    return keepValidCandidates(output.incidents, articles);
}

export async function classifyInBatches(provider: Provider, articles: Article[], recent: KnownIncident[], companies: Record<string, string>, batchLimit: number): Promise<Candidate[]> {
    const sharedTokens = estimateTokens(INSTRUCTIONS + buildPrompt([], recent, companies));
    const batches = splitIntoBatches(articles, batchLimit - sharedTokens, (article) => estimateTokens(JSON.stringify(article)));

    const known: KnownIncident[] = Array.from(recent);
    const candidates: Candidate[] = [];

    for (const [index, batch] of batches.entries()) {
        console.log(`asking ${provider.model.modelId} about batch ${index + 1}/${batches.length}`);
        const found = await classify(provider, batch, known, companies);

        // later batches see what earlier ones found, so the same incident from another source is not added twice
        for (const candidate of found) {
            candidates.push(candidate);
            known.push({ date: candidate.date, title: candidate.title, company: candidate.companyKey });
        }
    }

    return candidates;
}
