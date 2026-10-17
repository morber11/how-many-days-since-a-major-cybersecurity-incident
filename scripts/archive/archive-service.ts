import { setTimeout as sleep } from "node:timers/promises";

const ARCHIVE_URL = "https://archive.is";
const HEADERS = { "User-Agent": "hmdsamci-discover" };
const POLL_INTERVAL_MS = 30_000;
const POLL_TIMEOUT_MS = 10 * 60_000;
const CAPTCHA_MAX_ATTEMPTS = 4;
const CAPTCHA_RETRY_DELAY_MS = 60_000;
const SHORT_LINK_PATTERN = /id="SHARE_SHORTLINK"[^>]*value="https?:\/\/archive\.\w+\/(\w+)"/;

type SnapshotLookup = { found: true; shortLink: string } | { found: false };

async function fetchPage(url: string): Promise<string> {
    for (let attempt = 1; attempt <= CAPTCHA_MAX_ATTEMPTS; attempt++) {
        const response = await fetch(url, { headers: HEADERS });
        const page = await response.text();

        const gotCaptcha = response.status === 429 || /captcha/i.test(page);
        if (!gotCaptcha) {
            return page;
        }

        if (attempt < CAPTCHA_MAX_ATTEMPTS) {
            console.warn(`archive.is asked for a captcha, retrying in ${CAPTCHA_RETRY_DELAY_MS / 1000}s`);
            await sleep(CAPTCHA_RETRY_DELAY_MS);
        }
    }

    throw new Error("archive.is asked for a captcha");
}

async function getShortLink(snapshotUrl: string): Promise<string> {
    const snapshotPage = await fetchPage(snapshotUrl);

    const snapshotId = snapshotPage.match(SHORT_LINK_PATTERN)?.[1];
    if (!snapshotId) {
        throw new Error(`could not find the short link on ${snapshotUrl}`);
    }

    return `${ARCHIVE_URL}/${snapshotId}`;
}

async function findSnapshot(url: string): Promise<SnapshotLookup> {
    const response = await fetch(`${ARCHIVE_URL}/timegate/${url}`, { redirect: "manual", headers: HEADERS });

    if (response.status === 404) {
        return { found: false };
    }

    const location = response.headers.get("location");
    if (response.status !== 302 || !location) {
        throw new Error(`archive.is lookup returned status ${response.status}`);
    }

    const snapshotUrl = `${ARCHIVE_URL}${new URL(location).pathname}`;

    return { found: true, shortLink: await getShortLink(snapshotUrl) };
}

export async function archive(url: string): Promise<string> {
    const existingSnapshot = await findSnapshot(url);
    if (existingSnapshot.found) {
        return existingSnapshot.shortLink;
    }

    await fetchPage(`${ARCHIVE_URL}/submit/?${new URLSearchParams({ url })}`);

    const deadline = Date.now() + POLL_TIMEOUT_MS;

    while (Date.now() < deadline) {
        await sleep(POLL_INTERVAL_MS);

        const snapshot = await findSnapshot(url);
        if (snapshot.found) {
            return snapshot.shortLink;
        }
    }

    throw new Error("timed out waiting for archive.is");
}
