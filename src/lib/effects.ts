// decorative effects that can be used as a MediaItem's onPlay
// each one cleans itself up when the audio is paused or ends

const FIREFLY_COUNT = 40;

export function fireflies(image: HTMLImageElement, _page: HTMLElement, audio: HTMLAudioElement) {
    const overlay = document.createElement("div");
    overlay.className = "effect-overlay effect-vignette";

    for (let i = 0; i < FIREFLY_COUNT; i++) {
        overlay.append(createFirefly());
    }

    image.before(overlay);

    overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 4000,
        easing: "ease-in",
        fill: "forwards",
    });

    // no starting keyframe so stopping mid fade in starts from the current opacity
    const stop = () => {
        overlay
            .animate({ opacity: 0 }, { duration: 1500, easing: "ease-out", fill: "forwards" })
            .finished.then(() => overlay.remove());
    };

    audio.addEventListener("pause", stop, { once: true });
    audio.addEventListener("ended", stop, { once: true });
}

export function pageFlip(image: HTMLImageElement, page: HTMLElement, audio: HTMLAudioElement) {
    image.style.transform = "rotateX(180deg)";
    page.style.transition = "transform 1s ease-in-out";

    const invertScroll = (event: WheelEvent) => {
        event.preventDefault();
        window.scrollBy(event.deltaX, -event.deltaY);
    };

    const flipTimer = window.setTimeout(() => {
        page.style.transform = "rotateX(180deg)";
        window.addEventListener("wheel", invertScroll, { passive: false });
    }, 2000 + Math.random() * 1000);

    const reset = () => {
        window.clearTimeout(flipTimer);
        window.removeEventListener("wheel", invertScroll);
        image.style.transform = "";
        page.style.transform = "";
    };

    audio.addEventListener("pause", reset, { once: true });
    audio.addEventListener("ended", reset, { once: true });
}

function createFirefly(): HTMLElement {
    const firefly = document.createElement("div");
    firefly.className = "firefly";

    const size = 3 + Math.random() * 9;
    firefly.style.width = `${size}px`;
    firefly.style.height = `${size}px`;

    // most fireflies gather in the bottom corners, the rest spread along the bottom edge
    const inCorner = Math.random() < 0.8;
    const x = inCorner ? Math.random() * 20 : 20 + Math.random() * 60;
    const left = inCorner && Math.random() < 0.5 ? x : 100 - x;
    const bottom = Math.random() * (inCorner ? 35 : 15);

    firefly.style.left = `${left}vw`;
    firefly.style.bottom = `${bottom}vh`;
    firefly.style.animationDelay = `${-Math.random() * 3}s`;

    const keyframes = [{ transform: "translate(0, 0)" }];
    for (let i = 0; i < 4; i++) {
        const dx = (Math.random() - 0.5) * 120;
        const dy = -Math.random() * 100;
        keyframes.push({ transform: `translate(${dx}px, ${dy}px)` });
    }

    firefly.animate(keyframes, {
        duration: 6000 + Math.random() * 6000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
    });

    return firefly;
}
