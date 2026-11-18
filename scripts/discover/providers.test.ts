import { APICallError, generateText } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it } from "vitest";
import { shouldTryNextProvider } from "./providers.ts";

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

describe("shouldTryNextProvider", () => {
    it("is true when an overloaded provider keeps failing after retries", async () => {
        await expect(generateText({ model: failingModel(503), prompt: "hello" })).rejects.toSatisfy(shouldTryNextProvider);
    });

    it("is true when the provider rejects the request, such as an invalid api key", async () => {
        await expect(generateText({ model: failingModel(400), prompt: "hello" })).rejects.toSatisfy(shouldTryNextProvider);
    });

    it("is false for errors that are not from the provider api", async () => {
        const model = new MockLanguageModelV4({
            doGenerate: async () => {
                throw new TypeError("bug in our code");
            },
        });

        await expect(generateText({ model: model, prompt: "hello" })).rejects.not.toSatisfy(shouldTryNextProvider);
    });
});
