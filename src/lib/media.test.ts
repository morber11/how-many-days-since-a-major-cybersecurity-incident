import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getMediaItems,
    selectMediaItem,
    pickRandomMediaItem,
    getOrPickMediaIndex
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
