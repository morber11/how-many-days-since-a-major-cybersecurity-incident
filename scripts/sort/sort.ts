import { readFileSync, writeFileSync } from "node:fs";
import { sortIncidentsFile } from "./sort-incidents-file.ts";

const INCIDENTS_FILE = "src/data/incidents.ts";

const source = readFileSync(INCIDENTS_FILE, "utf8");
const sorted = sortIncidentsFile(source);

if (sorted === source) {
    console.log(`${INCIDENTS_FILE} is already sorted`);
} else {
    writeFileSync(INCIDENTS_FILE, sorted);
    console.log(`sorted ${INCIDENTS_FILE}`);
}
