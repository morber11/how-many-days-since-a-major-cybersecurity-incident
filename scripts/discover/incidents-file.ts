import type { NewEntry } from "./types.ts";

const DATE_LINE_PATTERN = /date: "(\d{4}-\d{2}-\d{2})"/;

function renderEntry(entry: NewEntry): string[] {
    const sourceUrl = entry.archivedUrl
        ? `        sourceUrl: ${JSON.stringify(entry.archivedUrl)},`
        : `        sourceUrl: ${JSON.stringify(entry.sourceUrl)}, // TODO: archive manually`;

    const lines = [
        "    {",
        `        date: ${JSON.stringify(entry.date)},`,
        `        title: ${JSON.stringify(entry.title)},`,
        `        company: COMPANY.${entry.companyKey},`,
        `        description: ${JSON.stringify(entry.description)},`,
        sourceUrl,
    ];

    if (entry.additionalNotes) {
        lines.push(`        additionalNotes: ${JSON.stringify(entry.additionalNotes)},`);
    }

    lines.push("    },");

    return lines;
}

function findInsertIndex(lines: string[], incidentsStart: number, date: string): number {
    for (let i = incidentsStart; i < lines.length - 1; i++) {
        if (lines[i] !== "    {") {
            continue;
        }

        const existingDate = lines[i + 1].match(DATE_LINE_PATTERN)?.[1];
        if (existingDate && existingDate < date) {
            return i;
        }
    }

    return lines.lastIndexOf("];");
}

function insertAt(lines: string[], index: number, newLines: string[]): string[] {
    return lines.slice(0, index).concat(newLines, lines.slice(index));
}

export function insertIncidents(source: string, entries: NewEntry[], companies: Record<string, string>): string {
    const eol = source.includes("\r\n") ? "\r\n" : "\n";
    let lines = source.split(/\r?\n/);

    const incidentsStart = lines.findIndex((line) => line.startsWith("export const incidents"));
    const newestFirst = entries.toSorted((a, b) => b.date.localeCompare(a.date));

    for (const entry of newestFirst) {
        const index = findInsertIndex(lines, incidentsStart, entry.date);
        lines = insertAt(lines, index, renderEntry(entry));
    }

    const newCompanies = new Map<string, string>();

    for (const entry of entries) {
        if (!(entry.companyKey in companies)) {
            newCompanies.set(entry.companyKey, entry.companyName);
        }
    }

    const companyEnd = lines.indexOf("} as const;");
    const companyLines = Array.from(newCompanies, ([key, name]) => `    ${key}: ${JSON.stringify(name)},`);
    lines = insertAt(lines, companyEnd, companyLines);

    return lines.join(eol);
}
