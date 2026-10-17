const UNARCHIVED_SOURCE_URL_PATTERN = /sourceUrl: "(?!https:\/\/archive\.is\/)([^"]+)"(,?)(?: \/\/.*)?/g;

export function findUnarchivedUrls(source: string): string[] {
    return Array.from(source.matchAll(UNARCHIVED_SOURCE_URL_PATTERN), (match) => match[1]);
}

export function applyArchivedUrls(source: string, archivedUrls: Map<string, string>): string {
    return source.replace(UNARCHIVED_SOURCE_URL_PATTERN, (line, url: string, comma: string) => {
        const archivedUrl = archivedUrls.get(url);

        return archivedUrl ? `sourceUrl: ${JSON.stringify(archivedUrl)}${comma}` : line;
    });
}
