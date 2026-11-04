import { APICallError, generateText } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it } from "vitest";
import { isProviderBusy } from "./providers.ts";

function failingModel(statusCode: number): MockLanguageModelV4 {
    return new MockLanguageModelV4({
        doGenerate: async () => {
            throw new APICallError({
                message: `failed with ${statusCode}`,
                url: "https://example.com",
                requestBodyValues: {},
                statusCode: statusCode,
                responseHeaders: { "retry-after-ms": "0" },
            });
        },
    });
}

describe("isProviderBusy", () => {
    it("is true when an overloaded provider keeps failing after retries", async () => {
        await expect(generateText({ model: failingModel(503), prompt: "hello" })).rejects.toSatisfy(isProviderBusy);
    });

    it("is false for errors that retrying cannot fix, such as a bad api key", async () => {
        await expect(generateText({ model: failingModel(401), prompt: "hello" })).rejects.not.toSatisfy(isProviderBusy);
    });
});
