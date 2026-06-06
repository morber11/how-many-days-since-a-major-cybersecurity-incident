import { describe, it, expect } from 'vitest';
import { getMediaItems, selectMediaItem, pickRandomMediaItem } from './media';

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
