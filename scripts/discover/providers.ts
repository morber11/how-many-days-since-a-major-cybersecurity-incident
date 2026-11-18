import { anthropic } from "@ai-sdk/anthropic";
import { deepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { APICallError, RetryError, type LanguageModel } from "ai";

export interface Provider {
    model: Exclude<LanguageModel, string>;
    apiKeyVariable: string;
    providerOptions?: Record<string, Record<string, string | boolean>>;
}

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// declaration order is the default rotation order, so keep free providers first, then the cheapest
export const PROVIDERS = {
    gemini: {
        model: google("gemini-3.8-flash"),
        apiKeyVariable: "GEMINI_API_KEY",
    },
    groq: {
        model: groq("openai/gpt-oss-120b"),
        apiKeyVariable: "GROQ_API_KEY",
        providerOptions: { groq: { strictJsonSchema: false } },
    },
    deepseek: {
        model: deepSeek("deepseek-flash"),
        apiKeyVariable: "DEEPSEEK_API_KEY",
    },
    anthropic: {
        model: anthropic("claude-opus-5-5"),
        apiKeyVariable: "ANTHROPIC_API_KEY",
        providerOptions: { anthropic: { effort: "medium" } },
    },
} satisfies Record<string, Provider>;

export type ProviderName = keyof typeof PROVIDERS;

export function isProviderName(name: string): name is ProviderName {
    return Object.hasOwn(PROVIDERS, name);
}

export function availableProviders(names: ProviderName[]): Provider[] {
    const providers: Provider[] = [];

    for (const name of names) {
        const provider = PROVIDERS[name];

        if (!process.env[provider.apiKeyVariable]) {
            console.warn(`skipping provider ${name}, ${provider.apiKeyVariable} is not set`);
            continue;
        }

        providers.push(provider);
    }

    return providers;
}

export function shouldTryNextProvider(error: unknown): boolean {
    const isBusy = RetryError.isInstance(error) && error.reason === "maxRetriesExceeded";
    const isTooLarge = APICallError.isInstance(error) && error.statusCode === 413;

    return isBusy || isTooLarge;
}
