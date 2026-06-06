export interface MediaItem {
    image: string;
    audio?: string;
    width?: number;
    height?: number;
}

// add in specific width/height because the sprite sizes can vary
// and giving an exact width/height is the easiest fix
// MediaItems are preparing - please wait warmly
const items: MediaItem[] = [
    { image: "/raymoo.png", audio: "/eosd-titlescreen.mp3", width: 256, height: 256 },
    { image: "/npm-left-pad-incident.png", audio: "/pcb-titlescreen.mp3", width: 128, height: 256 },
    { image: "/merchant.png", audio: "/sa-titlescreen.mp3", width: 128, height: 256 },
];

export function getMediaItems(): MediaItem[] {
    return items;
}

export function selectMediaItem(index: number): MediaItem {
    return items[index % items.length];
}

export function pickRandomMediaItem(): MediaItem {
    return items[Math.floor(Math.random() * items.length)];
}

const STORAGE_KEY = "hmdsamci-media-index";

export function getOrPickMediaIndex(): number {
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const isReload = navEntry?.type === "reload";

    let storedIndex = sessionStorage.getItem(STORAGE_KEY);

    if (isReload || storedIndex === null) {
        storedIndex = String(Math.floor(Math.random() * items.length));
        sessionStorage.setItem(STORAGE_KEY, storedIndex);
    }

    return Number(storedIndex);
}
