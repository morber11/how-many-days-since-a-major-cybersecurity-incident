import { anthropic } from "@ai-sdk/anthropic";
import { deepSeek } from "@ai-sdk/deepseek";
import type { LanguageModel } from "ai";

export interface Provider {
    model: LanguageModel;
    apiKeyVariable: string;
    providerOptions?: Record<string, Record<string, string>>;
}

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
} satisfies Record<string, Provider>;

export type ProviderName = keyof typeof PROVIDERS;

export function isProviderName(name: string): name is ProviderName {
    return Object.hasOwn(PROVIDERS, name);
}
