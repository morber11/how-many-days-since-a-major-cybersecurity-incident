import { describe, expect, it } from "vitest";
import { sortIncidentsFile } from "./sort-incidents-file.ts";

const UNSORTED = [
    "const intro = 1;",
    "export const COMPANY = {",
    '    ZOOM: "Zoom",',
    '    AMGEN: "Amgen",',
    '    ANTHROPIC: "Anthropic",',
    "} as const;",
    "",
    "export const incidents: Incident[] = [",
    "    {",
    '        date: "2026-01-10",',
    '        title: "Oldest",',
    '        description: "d",',
    "    }",
    "    ,",
    "    {",
    '        date: "2026-03-10",',
    '        title: "Newest first of the day",',
    '        description: "d",',
    "    },",
    "    {",
    '        date: "2026-03-10",',
    '        title: "Newest second of the day",',
    '        description: "d",',
    "    },",
    "    {",
    '        date: "2026-02-10",',
    '        title: "Middle",',
    '        description: "d",',
    "    }",
    "];",
    "",
].join("\r\n");

function titles(source: string): string[] {
    return Array.from(source.matchAll(/title: "(.*)"/g), (match) => match[1]);
}

describe("sortIncidentsFile", () => {
    const sorted = sortIncidentsFile(UNSORTED);

    it("orders incidents newest-first and keeps same-day entries in their original order", () => {
        expect(titles(sorted)).toEqual(["Newest first of the day", "Newest second of the day", "Middle", "Oldest"]);
    });

    it("orders companies A-Z", () => {
        expect(sorted.indexOf("AMGEN")).toBeLessThan(sorted.indexOf("ANTHROPIC"));
        expect(sorted.indexOf("ANTHROPIC")).toBeLessThan(sorted.indexOf("ZOOM"));
    });

    it("keeps the rest of the file, CRLF line endings, and is idempotent", () => {
        expect(sorted).toContain("const intro = 1;");
        expect(sorted).not.toMatch(/[^\r]\n/);
        expect(sortIncidentsFile(sorted)).toBe(sorted);
    });

    it("closes every entry with a comma, including the stray ones in the original", () => {
        expect(sorted.match(/^ {4}\},$/gm)).toHaveLength(4);
        expect(sorted).not.toMatch(/^ {4},$/m);
    });
});
