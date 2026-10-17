import { anthropic } from "@ai-sdk/anthropic";
import { deepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

export interface Provider {
    model: Exclude<LanguageModel, string>;
    apiKeyVariable: string;
    providerOptions?: Record<string, Record<string, string>>;
}

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export const PROVIDERS = {
    anthropic: {
        model: anthropic("claude-opus-5-5"),
        apiKeyVariable: "ANTHROPIC_API_KEY",
        providerOptions: { anthropic: { effort: "medium" } },
    },
    deepseek: {
        model: deepSeek("deepseek-flash"),
        apiKeyVariable: "DEEPSEEK_API_KEY",
    },
    gemini: {
        model: google("gemini-3.8-flash"),
        apiKeyVariable: "GEMINI_API_KEY",
    },
} satisfies Record<string, Provider>;

export type ProviderName = keyof typeof PROVIDERS;

export function isProviderName(name: string): name is ProviderName {
    return Object.hasOwn(PROVIDERS, name);
}
