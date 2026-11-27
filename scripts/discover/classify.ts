import { generateText, Output } from "ai";
import { z } from "zod";
import { splitIntoBatches } from "../batching/batching.ts";
import { withRotation } from "../rotation/rotation.ts";
import { INSTRUCTIONS } from "./instructions.ts";
import { shouldTryNextProvider, type Provider } from "./providers.ts";
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

function cleanText(text: string): string {
    return text
        .replaceAll("\u2019", "'") // right single quote
        .replaceAll("\u2011", "-") // non-breaking hyphen
        .replace(/[\u00A0\u2007\u2009\u202F]/g, " ") // no-break and thin spaces
        .replace(/[\u200B-\u200D\u2060\uFEFF]/g, ""); // zero width characters
}

function cleanCandidate(candidate: Candidate): Candidate {
    return {
        date: candidate.date,
        title: cleanText(candidate.title),
        companyKey: candidate.companyKey,
        companyName: cleanText(candidate.companyName),
        description: cleanText(candidate.description),
        additionalNotes: candidate.additionalNotes && cleanText(candidate.additionalNotes),
        sourceUrl: candidate.sourceUrl,
    };
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

    return keepValidCandidates(output.incidents.map(cleanCandidate), articles);
}

function splitForProvider(provider: Provider, articles: Article[], recent: KnownIncident[], companies: Record<string, string>): Article[][] {
    if (!provider.batchLimit) {
        return [articles];
    }

    const sharedTokens = estimateTokens(INSTRUCTIONS + buildPrompt([], recent, companies));

    return splitIntoBatches(articles, provider.batchLimit - sharedTokens, (article) => estimateTokens(JSON.stringify(article)));
}

export async function classifyWithRotation(providers: Provider[], articles: Article[], recent: KnownIncident[], companies: Record<string, string>): Promise<Candidate[]> {
    const candidates: Candidate[] = [];
    let remaining = articles;

    await withRotation(providers, async (provider) => {
        const batches = splitForProvider(provider, remaining, recent, companies);

        for (const [index, batch] of batches.entries()) {
            console.log(`asking ${provider.model.modelId} about batch ${index + 1}/${batches.length}`);

            const found = recent.concat(candidates.map((candidate) => ({ date: candidate.date, title: candidate.title, company: candidate.companyKey })));
            const newCandidates = await classify(provider, batch, found, companies);

            for (const candidate of newCandidates) {
                candidates.push(candidate);
            }

            remaining = remaining.filter((article) => !batch.includes(article));
        }
    }, {
        shouldRotate: shouldTryNextProvider,
        onRotate: (provider, error) => console.warn(`${provider.model.modelId} failed, trying the next provider: ${error}`),
    });

    return candidates;
}
