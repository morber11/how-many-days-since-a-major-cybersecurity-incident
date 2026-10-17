import { setTimeout as sleep } from "node:timers/promises";

const HEADERS = { "User-Agent": "hmdsamci-discover" };
const POLL_INTERVAL_MS = 30_000;
const POLL_TIMEOUT_MS = 10 * 60_000;

type SnapshotLookup = { archived: true; snapshotUrl: string } | { archived: false };

async function lookupSnapshot(url: string): Promise<SnapshotLookup> {
    const response = await fetch(`https://archive.is/timegate/${url}`, { redirect: "manual", headers: HEADERS });

    if (response.status === 404) {
        return { archived: false };
    }

    const location = response.headers.get("location");
    if (response.status !== 302 || !location) {
        throw new Error(`archive.is lookup returned status ${response.status}`);
    }

    return { archived: true, snapshotUrl: `https://archive.is${new URL(location).pathname}` };
}

export async function archive(url: string): Promise<string> {
    const existing = await lookupSnapshot(url);
    if (existing.archived) {
        return existing.snapshotUrl;
    }

    const submitUrl = `https://archive.is/?${new URLSearchParams({ run: "1", url })}`;
    const response = await fetch(submitUrl, { headers: HEADERS });
    const body = await response.text();

    if (response.status === 429 || /captcha/i.test(body)) {
        throw new Error("archive.is asked for a captcha");
    }

    const deadline = Date.now() + POLL_TIMEOUT_MS;

    while (Date.now() < deadline) {
        await sleep(POLL_INTERVAL_MS);

        const snapshot = await lookupSnapshot(url);
        if (snapshot.archived) {
            return snapshot.snapshotUrl;
        }
    }

    throw new Error("timed out waiting for archive.is");
}
