const COMPANY_START = "export const COMPANY = {";
const COMPANY_END = "} as const;";
const INCIDENTS_START_PREFIX = "export const incidents";
const INCIDENTS_END = "];";
const ENTRY_START = "    {";
const ENTRY_END = "    },";

const DATE_LINE_PATTERN = /date: "(\d{4}-\d{2}-\d{2})"/;
const ENTRY_CLOSING_LINE_PATTERN = /^ {4}(\},?|,)$/;

interface Entry {
    date: string;
    lines: string[];
}

function sortCompanies(lines: string[]): string[] {
    const start = lines.indexOf(COMPANY_START) + 1;
    const end = lines.indexOf(COMPANY_END);

    const companyKey = (line: string) => line.slice(0, line.indexOf(":")).trim();
    const sorted = lines.slice(start, end).sort((a, b) => companyKey(a).localeCompare(companyKey(b)));

    return lines.slice(0, start).concat(sorted, lines.slice(end));
}

function parseEntries(lines: string[]): Entry[] {
    if (lines[0] !== ENTRY_START) {
        throw new Error(`expected the first line of the incidents array to be "${ENTRY_START}"`);
    }

    const entries: string[][] = [];

    for (const line of lines) {
        if (line === ENTRY_START) {
            entries.push([]);
        }

        entries[entries.length - 1].push(line);
    }

    return entries.map((entryLines) => {
        const date = entryLines[1].match(DATE_LINE_PATTERN)?.[1];

        if (!date) {
            throw new Error(`expected a date on the second line of the entry: ${entryLines[1]}`);
        }

        const closingStart = entryLines.findIndex((line, i) => i > 0 && ENTRY_CLOSING_LINE_PATTERN.test(line));
        const entryBody = entryLines.slice(0, closingStart);

        return { date, lines: entryBody.concat(ENTRY_END) };
    });
}

function sortIncidents(lines: string[]): string[] {
    const start = lines.findIndex((line) => line.startsWith(INCIDENTS_START_PREFIX)) + 1;
    const end = lines.lastIndexOf(INCIDENTS_END);

    const entries = parseEntries(lines.slice(start, end));
    const newestFirst = entries.toSorted((a, b) => b.date.localeCompare(a.date));

    return lines.slice(0, start).concat(newestFirst.flatMap((entry) => entry.lines), lines.slice(end));
}

export function sortIncidentsFile(source: string): string {
    const eol = source.includes("\r\n") ? "\r\n" : "\n";
    const lines = source.split(/\r?\n/);

    return sortIncidents(sortCompanies(lines)).join(eol);
}
