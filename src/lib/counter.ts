import { incidents } from '../data/incidents';

export function getMostRecentIncident() {
    return incidents[0];
}

export function getRecentIncidents() {
    return incidents.slice(1, 3);
}

export function getIncidentCount() {
    return incidents.length;
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
    if (days === 0) return "Seriously ? Not even a full day ?";
    if (days <= 4) return "Can we get through an entire week without an incident ?";
    if (days <= 6) return "Did not last even a week";
    if (days <= 13) return "Not even a fortnite";
    if (days <= 29) return "Two whole weeks! That's one entire sprint";
    if (days === 69) return "Funny number";
    if (days <= 89) return "One month. Impressive";
    if (days <= 179) return "Three months ? Maybe I just stopped updating this site ?";
    if (days <= 364) return "Half a year. I find that very questionable";

    return "One year. This site is probably unmaintained at this point";
}

type Gap = {
    days: number;
    dateA: string;
    incidentA: string;
    dateB: string;
    incidentB: string;
};

export function getMaxDaysBetweenIncidents(): Gap | null {
    const relevant = incidents.filter((inc) => !inc.excludeFromDateGap);

    if (relevant.length < 2) return null;

    let max = 0;
    let result: Gap | null = null;

    for (let i = 0; i < relevant.length - 1; i++) {
        const a = new Date(relevant[i + 1].date);
        const b = new Date(relevant[i].date);
        a.setHours(0, 0, 0, 0);
        b.setHours(0, 0, 0, 0);

        const days = Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

        if (days > max) {
            max = days;
            result = {
                days,
                dateA: relevant[i + 1].date,
                incidentA: relevant[i + 1].title,
                dateB: relevant[i].date,
                incidentB: relevant[i].title,
            };
        }
    }

    return result;
}
