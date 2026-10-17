import { describe, expect, it } from "vitest";
import { insertIncidents } from "./incidents-file.ts";
import type { NewEntry } from "./types.ts";

const SOURCE = [
    "const COMPANY = {",
    '    ACME: "Acme",',
    "} as const;",
    "",
    "export const incidents: Incident[] = [",
    "    {",
    '        date: "2026-03-10",',
    '        title: "Newest",',
    "        company: COMPANY.ACME,",
    '        description: "d",',
    '        sourceUrl: "https://archive.is/a",',
    "    },",
    "    {",
    '        date: "2026-02-10",',
    '        title: "Middle",',
    "        company: COMPANY.ACME,",
    '        description: "d",',
    '        sourceUrl: "https://archive.is/b",',
    "    },",
    "    {",
    '        date: "2026-01-10",',
    '        title: "Oldest",',
    "        company: COMPANY.ACME,",
    '        description: "d",',
    '        sourceUrl: "https://archive.is/c",',
    "    },",
    "];",
    "",
].join("\r\n");

const COMPANIES = { ACME: "Acme" };
const DATE_LINE_PATTERN = /date: "(\d{4}-\d{2}-\d{2})"/g;
const LINE_FEED_WITHOUT_CARRIAGE_RETURN_PATTERN = /[^\r]\n/;

function entry(overrides: Partial<NewEntry>): NewEntry {
    const defaults: NewEntry = {
        date: "2026-02-20",
        title: "New",
        companyKey: "ACME",
        companyName: "Acme",
        description: "d",
        sourceUrl: "https://example.com/article",
        archivedUrl: "https://archive.is/20260220000000/https://example.com/article",
    };

    return Object.assign(defaults, overrides);
}

function dates(source: string): string[] {
    return Array.from(source.matchAll(DATE_LINE_PATTERN), (match) => match[1]);
}

describe("insertIncidents", () => {
    it("keeps incidents sorted newest-first", () => {
        const entries = [
            entry({ date: "2026-01-01" }),
            entry({ date: "2026-04-01" }),
            entry({ date: "2026-02-20" }),
        ];

        const result = insertIncidents(SOURCE, entries, COMPANIES);

        expect(dates(result)).toEqual([
            "2026-04-01",
            "2026-03-10",
            "2026-02-20",
            "2026-02-10",
            "2026-01-10",
            "2026-01-01",
        ]);
    });

    it("adds an unknown company once and leaves known companies alone", () => {
        const entries = [
            entry({ companyKey: "NEW_CO", companyName: "New Co" }),
            entry({ companyKey: "NEW_CO", companyName: "New Co", date: "2026-02-21" }),
            entry({ companyKey: "ACME" }),
        ];

        const result = insertIncidents(SOURCE, entries, COMPANIES);

        expect(result.match(/NEW_CO: "New Co",/g)).toHaveLength(1);
        expect(result.match(/ACME: "Acme",/g)).toHaveLength(1);
        expect(result.indexOf('NEW_CO: "New Co",')).toBeLessThan(result.indexOf("} as const;"));
    });

    it("marks entries that could not be archived", () => {
        const result = insertIncidents(SOURCE, [entry({ archivedUrl: undefined })], COMPANIES);

        expect(result).toContain('sourceUrl: "https://example.com/article", // TODO: archive manually');
    });

    it("uses the archive url when there is one", () => {
        const result = insertIncidents(SOURCE, [entry({})], COMPANIES);

        expect(result).toContain("https://archive.is/20260220000000/https://example.com/article");
        expect(result).not.toContain("TODO");
    });

    it("preserves CRLF line endings", () => {
        const result = insertIncidents(SOURCE, [entry({ companyKey: "NEW_CO", companyName: "New Co" })], COMPANIES);

        expect(result).not.toMatch(LINE_FEED_WITHOUT_CARRIAGE_RETURN_PATTERN);
    });
});
