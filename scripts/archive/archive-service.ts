import { setTimeout as sleep } from "node:timers/promises";

const ARCHIVE_URL = "https://archive.is";
const HEADERS = { "User-Agent": "hmdsamci-discover" };
const POLL_INTERVAL_MS = 30_000;
const POLL_TIMEOUT_MS = 10 * 60_000;
const SHORT_LINK_PATTERN = /id="SHARE_SHORTLINK"[^>]*value="https?:\/\/archive\.\w+\/(\w+)"/;

type SnapshotLookup = { archived: true; snapshotUrl: string } | { archived: false };

async function lookupSnapshot(url: string): Promise<SnapshotLookup> {
    const response = await fetch(`${ARCHIVE_URL}/timegate/${url}`, { redirect: "manual", headers: HEADERS });

    if (response.status === 404) {
        return { archived: false };
    }

    const location = response.headers.get("location");
    if (response.status !== 302 || !location) {
        throw new Error(`archive.is lookup returned status ${response.status}`);
    }

    return { archived: true, snapshotUrl: await fetchShortUrl(`${ARCHIVE_URL}${new URL(location).pathname}`) };
}

async function fetchShortUrl(snapshotUrl: string): Promise<string> {
    const response = await fetch(snapshotUrl, { headers: HEADERS });
    const body = await response.text();

    const id = body.match(SHORT_LINK_PATTERN)?.[1];
    if (!id) {
        throw new Error(`could not find the short link on ${snapshotUrl}`);
    }

    return `${ARCHIVE_URL}/${id}`;
}

export async function archive(url: string): Promise<string> {
    const existing = await lookupSnapshot(url);
    if (existing.archived) {
        return existing.snapshotUrl;
    }

    const submitUrl = `${ARCHIVE_URL}/submit/?${new URLSearchParams({ url })}`;
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
