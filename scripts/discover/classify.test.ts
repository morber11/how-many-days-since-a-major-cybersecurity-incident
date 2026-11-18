import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it } from "vitest";
import { classify, classifyInBatches } from "./classify.ts";
import { INSTRUCTIONS } from "./instructions.ts";
import type { Article, Candidate } from "./types.ts";

function article(url: string, date: string): Article {
    return { source: "news", title: `story at ${url}`, url: url, date: date, summary: "x".repeat(1500) };
}

function response(incidents: Candidate[]): Awaited<ReturnType<MockLanguageModelV4["doGenerate"]>> {
    return {
        content: [{ type: "text", text: JSON.stringify({ incidents }) }],
        finishReason: { unified: "stop", raw: "stop" },
        usage: {
            inputTokens: { total: 0, noCache: 0, cacheRead: 0, cacheWrite: 0 },
            outputTokens: { total: 0, text: 0, reasoning: 0 },
        },
        warnings: [],
    };
}

describe("classify", () => {
    it("replaces typographic quotes, non-breaking hyphens and invisible spaces in the text fields", async () => {
        const articles = [article("https://example.com/a", "2026-11-16")];
        const found: Candidate = {
            date: "2026-11-16",
            title: "Example Corp\u2019s data\u2011broker breach",
            companyKey: "EXAMPLE",
            companyName: "Example\u202FCorp",
            description: "Attackers\u200B stole\u00A0records",
            additionalNotes: "First\u2019s",
            sourceUrl: "https://example.com/a",
        };
        const model = new MockLanguageModelV4({ doGenerate: [response([found])] });

        const candidates = await classify({ model: model, apiKeyVariable: "TEST_API_KEY" }, articles, [], {});

        expect(candidates).toEqual([{
            date: "2026-11-16",
            title: "Example Corp's data-broker breach",
            companyKey: "EXAMPLE",
            companyName: "Example Corp",
            description: "Attackers stole records",
            additionalNotes: "First's",
            sourceUrl: "https://example.com/a",
        }]);
    });
});

describe("classifyInBatches", () => {
    it("splits articles into batches and tells later batches what was already found", async () => {
        const articles = [article("https://example.com/a", "2026-11-16"), article("https://example.com/b", "2026-11-17")];
        const found: Candidate = {
            date: "2026-11-16",
            title: "Example Corp breach",
            companyKey: "EXAMPLE",
            companyName: "Example Corp",
            description: "Example Corp was breached.",
            sourceUrl: "https://example.com/a",
        };
        const model = new MockLanguageModelV4({ doGenerate: [response([found]), response([])] });

        const provider = { model: model, apiKeyVariable: "TEST_API_KEY" };
        const batchLimit = Math.ceil(INSTRUCTIONS.length / 4) + 600;

        const candidates = await classifyInBatches(provider, articles, [], {}, batchLimit);

        expect(candidates).toEqual([found]);
        expect(model.doGenerateCalls).toHaveLength(2);
        expect(JSON.stringify(model.doGenerateCalls[1].prompt)).toContain("Example Corp breach");
    });
});
