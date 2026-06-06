import { incidents } from '../data/incidents';

export function getMostRecentIncident() {
    return incidents[0];
}

export function getRecentIncidents() {
    return incidents.slice(1, 3);
}

export function getDaysSince(dateString: string): number {
    const incident = new Date(dateString);
    const today = new Date();

    // zero out time component so we count whole days only
    incident.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const ms = today.getTime() - incident.getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function getStatusText(days: number): string {
    if (days === 0) return "Did not last even a week";
    if (days <= 6) return "So close to an entire week";
    if (days <= 13) return "Not even a fortnite";
    if (days <= 29) return "Two whole weeks! That's one entire sprint";
    if (days <= 89) return "One month. Impressive";
    if (days <= 179) return "Three months ? Maybe I just stopped updating this site ?";
    if (days <= 364) return "Half a year. I find that very questionable";

    return "One year. This site is probably unmaintained at this point";
}
