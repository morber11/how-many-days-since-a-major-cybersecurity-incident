import { readFileSync, writeFileSync } from "node:fs";
import { archive } from "./archive-service.ts";
import { applyArchivedUrls, findUnarchivedUrls } from "./archive-incidents-file.ts";

const INCIDENTS_FILE = "src/data/incidents.ts";

async function archiveUrls(urls: string[]): Promise<Map<string, string>> {
    const archivedUrls = new Map<string, string>();
    let finished = 0;

    for (const url of urls) {
        try {
            archivedUrls.set(url, await archive(url));
        } catch (error) {
            console.warn(`could not archive ${url}: ${error}`);
        }

        finished++;
        console.log(`archiving ${finished}/${urls.length} done`);
    }

    return archivedUrls;
}

const source = readFileSync(INCIDENTS_FILE, "utf8");
const urls = findUnarchivedUrls(source);

if (urls.length === 0) {
    console.log("nothing to archive");
    process.exit(0);
}

console.log(`archiving ${urls.length} sources on archive.is, new snapshots can take a few minutes`);
const archivedUrls = await archiveUrls(urls);

writeFileSync(INCIDENTS_FILE, applyArchivedUrls(source, archivedUrls));
console.log(`archived ${archivedUrls.size}/${urls.length} sources in ${INCIDENTS_FILE}`);
