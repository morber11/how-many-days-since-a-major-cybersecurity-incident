import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getMediaItems,
    selectMediaItem,
    pickRandomMediaItem,
    findMediaIndex,
    getOrPickMediaIndex,
    createAltClickRoll
} from './media';

describe('getMediaItems', () => {
    it('returns a non-empty array', () => {
        expect(getMediaItems().length).toBeGreaterThan(0);
    });
});

describe('selectMediaItem', () => {
    it('returns the first item for index 0', () => {
        expect(selectMediaItem(0)).toBe(getMediaItems()[0]);
    });

    it('wraps around for out-of-range indices', () => {
        const items = getMediaItems();
        const large = items.length * 10 + 3;
        expect(selectMediaItem(large)).toBe(items[large % items.length]);
    });
});

describe('pickRandomMediaItem', () => {
    it('returns a valid item from the list', () => {
        const item = pickRandomMediaItem();
        const items = getMediaItems();
        expect(items).toContain(item);
    });
});

describe('findMediaIndex', () => {
    it('matches ids regardless of case', () => {
        const index = findMediaIndex('Seija');

        expect(index).toBe(findMediaIndex('seija'));
        expect(getMediaItems()[index].id).toBe('seija');
    });

    it('returns -1 for an unknown id', () => {
        expect(findMediaIndex('nobody')).toBe(-1);
    });
});

describe('createAltClickRoll', () => {
    const seijaAltClick = getMediaItems().find((item) => item.id === 'seija')?.altClick;
    if (!seijaAltClick) throw new Error('seija has no alt click');

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('fires for a random value below the chance', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.09);
        const roll = createAltClickRoll();

        expect(roll(seijaAltClick)).toBe(true);
    });

    it('does not fire for a random value at the chance', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.1);
        const roll = createAltClickRoll();

        expect(roll(seijaAltClick)).toBe(false);
    });

    it('rises after a miss', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.12);
        const roll = createAltClickRoll();

        expect(roll(seijaAltClick)).toBe(false);
        expect(roll(seijaAltClick)).toBe(true);
    });

    it('resets after a hit', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.12);
        const roll = createAltClickRoll();

        roll(seijaAltClick);
        roll(seijaAltClick);

        expect(roll(seijaAltClick)).toBe(false);
    });

    it('does not rise when the per-click increase is 0', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.12);
        const roll = createAltClickRoll();
        const altClick = { ...seijaAltClick, chanceIncreasePerClick: 0 };

        expect(roll(altClick)).toBe(false);
        expect(roll(altClick)).toBe(false);
    });

    it('rises by the per-click increase set on the alt click', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.115);
        const roll = createAltClickRoll();
        const altClick = { ...seijaAltClick, chanceIncreasePerClick: 0.01 };

        expect(roll(altClick)).toBe(false);
        expect(roll(altClick)).toBe(false);
        expect(roll(altClick)).toBe(true);
    });
});

describe('getOrPickMediaIndex', () => {
    beforeEach(() => {
        const store: Record<string, string> = {};
        vi.stubGlobal('sessionStorage', {
            getItem: (key: string) => store[key] ?? null,
            setItem: (key: string, value: string) => { store[key] = value; },
            clear: () => { Object.keys(store).forEach(k => delete store[k]); },
        });
        vi.stubGlobal('performance', {
            getEntriesByType: () => [{ type: 'reload' }],
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('always returns a different index on simulated reloads', () => {
        const first = getOrPickMediaIndex();
        let previous = first;

        for (let i = 0; i < 100; i++) {
            const next = getOrPickMediaIndex();
            expect(next).not.toBe(previous);
            previous = next;
        }
    });
});
