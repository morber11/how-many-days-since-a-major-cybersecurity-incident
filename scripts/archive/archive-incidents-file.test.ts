import { describe, expect, it } from "vitest";
import { applyArchivedUrls, findUnarchivedUrls } from "./archive-incidents-file.ts";

const SOURCE = [
    "export const incidents = [",
    "    {",
    '        sourceUrl: "https://example.com/a", // TODO: archive manually',
    "    },",
    "    {",
    '        sourceUrl: "https://archive.is/AbC12",',
    "    },",
    "    {",
    '        sourceUrl: "https://example.com/c" // archive later - captcha has hit free tier',
    "    },",
    "    {",
    '        sourceUrl: "https://example.com/d"',
    "    },",
    "    {",
    '        sourceUrl: "https://web.archive.org/web/20261110133819/https://example.com/e",',
    "    },",
    "];",
].join("\r\n");

describe("findUnarchivedUrls", () => {
    it("finds every source url that is not an archive.is or wayback machine link, whatever the comment", () => {
        expect(findUnarchivedUrls(SOURCE)).toEqual([
            "https://example.com/a",
            "https://example.com/c",
            "https://example.com/d",
        ]);
    });
});

describe("applyArchivedUrls", () => {
    it("replaces archived entries, drops their comment, and keeps the rest", () => {
        const archivedUrls = new Map([
            ["https://example.com/a", "https://archive.is/aaaaa"],
            ["https://example.com/c", "https://archive.is/ccccc"],
        ]);

        const result = applyArchivedUrls(SOURCE, archivedUrls);

        expect(result).toContain('sourceUrl: "https://archive.is/aaaaa",\r\n');
        expect(result).toContain('sourceUrl: "https://archive.is/ccccc"\r\n');
        expect(findUnarchivedUrls(result)).toEqual(["https://example.com/d"]);
    });
});
