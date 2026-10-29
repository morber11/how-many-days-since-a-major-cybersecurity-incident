import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { COMPANY, incidents, type Incident } from "../../src/data/incidents.ts";
import { sortIncidentsFile } from "../sort/sort-incidents-file.ts";
import { archive } from "../archive/archive-service.ts";
import { classify } from "./classify.ts";
import { fetchArticles } from "./feeds.ts";
import { insertIncidents } from "./incidents-file.ts";
import { isProviderName, PROVIDERS, type Provider } from "./providers.ts";
import type { Candidate, NewEntry } from "./types.ts";

const PROVIDER_NAMES = Object.keys(PROVIDERS).join("|");
const USAGE = `usage: npm run discover -- [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--provider ${PROVIDER_NAMES}]`;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INCIDENTS_FILE = "src/data/incidents.ts";
const DEFAULT_LOOKBACK_DAYS = 7;

interface Options {
    from: string;
    to: string;
    provider: Provider;
}

function daysBefore(date: string, days: number): string {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() - days);

    return result.toISOString().slice(0, 10);
}

function parseOptions(): Options {
    const { values } = parseArgs({
        options: {
            from: { type: "string" },
            to: { type: "string" },
            provider: { type: "string" },
        },
    });

    const today = new Date().toISOString().slice(0, 10);
    const from = values.from ?? daysBefore(today, DEFAULT_LOOKBACK_DAYS);
    const to = values.to ?? today;
    const providerName = values.provider ?? process.env.DISCOVER_PROVIDER ?? "anthropic";

    if (!DATE_PATTERN.test(from) || !DATE_PATTERN.test(to) || from > to || !isProviderName(providerName)) {
        console.error(USAGE);
        process.exit(1);
    }

    const provider = PROVIDERS[providerName];

    console.log(`using provider ${providerName}, model ${provider.model.modelId}`);

    if (!process.env[provider.apiKeyVariable]) {
        console.error(`${provider.apiKeyVariable} is not set, set it in .env`);
        process.exit(1);
    }

    return {
        from: from,
        to: to,
        provider: provider,
    };
}

function incidentsInMonthBefore(date: string): Incident[] {
    const since = daysBefore(date, 30);

    return incidents.filter((incident) => incident.date >= since);
}

async function archiveCandidate(candidate: Candidate): Promise<NewEntry> {
    try {
        const archivedUrl = await archive(candidate.sourceUrl);
        return Object.assign({}, candidate, { archivedUrl });
    } catch (error) {
        console.warn(`could not archive ${candidate.sourceUrl}: ${error}`);
        return candidate;
    }
}

async function archiveCandidates(candidates: Candidate[]): Promise<NewEntry[]> {
    let finished = 0;

    return Promise.all(candidates.map(async (candidate) => {
        const entry = await archiveCandidate(candidate);

        finished++;
        console.log(`archiving ${finished}/${candidates.length} done`);

        return entry;
    }));
}

function saveEntries(entries: NewEntry[]): void {
    const source = readFileSync(INCIDENTS_FILE, "utf8");

    const updated = insertIncidents(source, entries, COMPANY);

    writeFileSync(INCIDENTS_FILE, sortIncidentsFile(updated));
}

function printSummary(entries: NewEntry[]): void {
    console.log(`added ${entries.length} incidents to ${INCIDENTS_FILE}`);

    for (const entry of entries) {
        console.log(`${entry.date}  ${entry.title}`);
    }

    const unarchived = entries.filter((entry) => !entry.archivedUrl);

    if (unarchived.length > 0) {
        console.log("needs manual archiving:");

        for (const entry of unarchived) {
            console.log(entry.sourceUrl);
        }
    }
}

async function main(): Promise<void> {
    const options = parseOptions();

    console.log(`fetching rss feeds for ${options.from} to ${options.to}`);
    const articles = await fetchArticles(options.from, options.to);

    if (articles.length === 0) {
        console.log(`no articles found between ${options.from} and ${options.to}`);
        return;
    }

    console.log(`asking the LLM to pick incidents from ${articles.length} articles, this can take a few minutes`);
    let candidates: Candidate[];

    try {
        candidates = await classify(options.provider, articles, incidentsInMonthBefore(options.from), COMPANY);
    } catch (error) {
        console.error(`could not get incidents from ${options.provider.model.modelId}: ${error}`);
        process.exit(1);
    }

    if (candidates.length === 0) {
        console.log("no new incidents found");
        return;
    }

    console.log(`archiving ${candidates.length} sources on archive.is, new snapshots can take up to 10 minutes`);
    const entries = await archiveCandidates(candidates);

    saveEntries(entries);
    printSummary(entries);
}

await main();
