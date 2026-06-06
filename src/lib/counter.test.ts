import { describe, it, expect, vi } from 'vitest';
import { getDaysSince, getStatusText, getMostRecentIncident, getRecentIncidents, getMaxDaysBetweenIncidents } from './counter';

describe('getDaysSince', () => {
    it('returns 0 for today', () => {
        const today = new Date().toISOString().slice(0, 10);
        expect(getDaysSince(today)).toBe(0);
    });

    it('returns a positive number for a past date', () => {
        expect(getDaysSince('2000-01-01')).toBeGreaterThan(0);
    });

    it('returns 0 for a future date', () => {
        expect(getDaysSince('2099-01-01')).toBe(0);
    });

    it('counts whole days only', () => {
        const fakeNow = new Date('2026-06-10T23:59:59');

        vi.setSystemTime(fakeNow);
        expect(getDaysSince('2026-06-09')).toBe(1);
        vi.useRealTimers();
    });
});

describe('getStatusText', () => {
    it('returns a string for any valid day count', () => {
        for (const days of [0, 1, 7, 14, 30, 90, 180, 365, 1000]) {
            expect(typeof getStatusText(days)).toBe('string');
            expect(getStatusText(days).length).toBeGreaterThan(0);
        }
    });

    it('returns different text for different bands', () => {
        expect(getStatusText(0)).not.toBe(getStatusText(7));
        expect(getStatusText(6)).not.toBe(getStatusText(7));
        expect(getStatusText(13)).not.toBe(getStatusText(14));
    });
});

describe('getMostRecentIncident', () => {
    it('returns the first incident', () => {
        const incident = getMostRecentIncident();

        expect(incident).toBeDefined();
    });
});

describe('getRecentIncidents', () => {
    it('returns the next 2 incidents after the most recent', () => {
        const recent = getRecentIncidents();

        expect(recent).toHaveLength(2);
    });
});

describe('getMaxDaysBetweenIncidents', () => {
    it('returns an object with days, dates, and incident titles', () => {
        const result = getMaxDaysBetweenIncidents();

        expect(result).not.toBeNull();
        expect(typeof result!.days).toBe('number');
        expect(typeof result!.dateA).toBe('string');
        expect(typeof result!.incidentA).toBe('string');
        expect(typeof result!.dateB).toBe('string');
        expect(typeof result!.incidentB).toBe('string');
    });

    it('has a positive day count', () => {
        const result = getMaxDaysBetweenIncidents();

        expect(result!.days).toBeGreaterThan(0);
    });
});
