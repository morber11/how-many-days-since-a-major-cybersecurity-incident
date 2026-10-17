import { readFileSync, writeFileSync } from "node:fs";
import { archive } from "./archive-service.ts";
import { applyArchivedUrls, findUnarchivedUrls } from "./archive-incidents-file.ts";

const INCIDENTS_FILE = "src/data/incidents.ts";
const BATCH_SIZE = 3;

function saveArchivedUrl(url: string, archivedUrl: string): void {
    const source = readFileSync(INCIDENTS_FILE, "utf8");

    writeFileSync(INCIDENTS_FILE, applyArchivedUrls(source, new Map([[url, archivedUrl]])));
}

async function archiveUrls(urls: string[]): Promise<number> {
    const startedAt = Date.now();
    let finished = 0;
    let archived = 0;

    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        await Promise.all(urls.slice(i, i + BATCH_SIZE).map(async (url) => {
            try {
                saveArchivedUrl(url, await archive(url));
                archived++;
            } catch (error) {
                console.warn(`could not archive ${url}: ${error}`);
            }

            finished++;
            const seconds = Math.round((Date.now() - startedAt) / 1000);
            console.log(`archiving ${finished}/${urls.length} done after ${seconds}s`);
        }));
    }

    return archived;
}

const urls = findUnarchivedUrls(readFileSync(INCIDENTS_FILE, "utf8"));

if (urls.length === 0) {
    console.log("nothing to archive");
    process.exit(0);
}

console.log(`archiving ${urls.length} sources on archive.is, new snapshots can take a few minutes`);
const archived = await archiveUrls(urls);

console.log(`archived ${archived}/${urls.length} sources in ${INCIDENTS_FILE}`);
