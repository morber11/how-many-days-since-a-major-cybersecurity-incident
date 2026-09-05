export interface MediaItem {
    image: string;
    audio?: string;
    width?: number;
    height?: number;
    volume?: number;
    transform?: string;
    transition?: string;
    onPlay?: (image: HTMLImageElement, page: HTMLElement, audio: HTMLAudioElement) => void;
    optionalFunction?: () => Partial<MediaItem> | undefined;
}

// add in specific width/height because the sprite sizes can vary
// and giving an exact width/height is the easiest fix
// audio - i can't be bothered to edit in audacity every time
// so adding it as a property means we can modify it in code
// MediaItems are preparing - please wait warmly
const items: MediaItem[] = [
    { image: "/images/raymoo.png", audio: "/audio/eosd-titlescreen.mp3", width: 256, height: 256, volume: 0.5 },
    { image: "/images/npm-left-pad-incident.png", audio: "/audio/pcb-titlescreen.mp3", width: 128, height: 256, volume: 0.4 },
    { image: "/images/merchant.png", audio: "/audio/sa-titlescreen.mp3", width: 128, height: 256, volume: 0.4 },
    { image: "/images/myon.png", audio: "/audio/in-titlescreen.mp3", width: 128, height: 256, volume: 0.4 },
    { image: "/images/usc.png", audio: "/audio/pofv-titlescreen.mp3", width: 128, height: 256, volume: 0.5, optionalFunction: plsRemberClick },
    { image: "/images/ayayayaayayayaayayaya.png", audio: "/audio/mof-titlescreen.mp3", width: 128, height: 256, volume: 0.4 },
    { image: "/images/snae.png", audio: "/audio/ufo-titlescreen.mp3", width: 128, height: 256, volume: 0.5 },
    { image: "/images/ohayou.png", audio: "/audio/td-titlescreen.mp3", width: 128, height: 256, volume: 0.5 },
    { image: "/images/seija.png", audio: "/audio/ddc-titlescreen.mp3", width: 128, height: 256, volume: 0.5, optionalFunction: seijaClick },
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
        if (isReload && storedIndex !== null) {
            const previous = Number(storedIndex);
            const offset = 1 + Math.floor(Math.random() * (items.length - 1));
            storedIndex = String((previous + offset) % items.length);
        } else {
            storedIndex = String(Math.floor(Math.random() * items.length));
        }
        sessionStorage.setItem(STORAGE_KEY, storedIndex);
    }

    return Number(storedIndex);
}

/* put custom functions for the optionalFunction param down here */
function plsRemberClick() {
    return Math.random() < 0.1 ? { audio: "/audio/pls-rember.mp3", image: "/images/pls-rember.png" } : { audio: "/audio/pofv-titlescreen.mp3" };
}

function seijaClick() {
    if (Math.random() < 0.1) {
        return {
            audio: "/audio/reverse-ideology.mp3",
            transform: "rotateX(180deg)",
            transition: "transform 0.5s ease-in-out",
            onPlay: (image: HTMLImageElement, page: HTMLElement, audio: HTMLAudioElement) => {
                page.style.transition = "transform 1s ease-in-out";

                const flipTimer = window.setTimeout(() => {
                    page.style.transform = "rotateX(180deg)";
                }, 2000 + Math.random() * 1000);

                const reset = () => {
                    window.clearTimeout(flipTimer);
                    image.style.transform = "";
                    page.style.transform = "";
                };

                audio.addEventListener("pause", reset, { once: true });
                audio.addEventListener("ended", reset, { once: true });
            },
        };
    }

    return { audio: "/audio/ddc-titlescreen.mp3" };
}
