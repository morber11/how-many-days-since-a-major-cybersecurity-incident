import { afterEach, describe, expect, it, vi } from "vitest";
import { archive } from "./archive-service.ts";

describe("archive", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("returns the short link for a page that is already archived", async () => {
        const fetchMock = vi.fn(async (input: string) => {
            if (input.includes("/timegate/")) {
                return new Response(null, {
                    status: 302,
                    headers: { location: "http://archive.md/20261017142410/https://example.com/a" },
                });
            }

            return new Response('<input id="SHARE_SHORTLINK" style="width:600px" value="http://archive.today/CHewb"/>');
        });
        vi.stubGlobal("fetch", fetchMock);

        expect(await archive("https://example.com/a")).toBe("https://archive.is/CHewb");
    });

    it("saves the page on the wayback machine when archive.is cannot be reached", async () => {
        const fetchMock = vi.fn(async (input: string) => {
            if (input.startsWith("https://archive.is/")) {
                throw new TypeError("fetch failed", { cause: new Error("connect timeout") });
            }

            return new Response(null, {
                status: 302,
                headers: { location: "https://web.archive.org/web/20261110133819/https://example.com/a" },
            });
        });
        vi.stubGlobal("fetch", fetchMock);

        expect(await archive("https://example.com/a")).toBe("https://web.archive.org/web/20261110133819/https://example.com/a");
    });
});
