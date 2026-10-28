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
    const [year, month, day] = dateString.split("-").map(Number);
    const incident = Date.UTC(year, month - 1, day);

    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    return Math.max(0, (today - incident) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}

export function getStatusText(days: number): string {
    if (days === 0) return "Seriously ? Not even a full day ?";
    if (days <= 4) return "Can we get through an entire week without an incident ?";
    if (days <= 6) return "Did not last even a week";
    if (days <= 13) return "Not even a fortnight";
    if (days <= 29) return "Two whole weeks! That's one entire sprint";
    if (days === 69) return "Funny number"; // hey wait a minute how is less than 89 days one month
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

type BusiestDay = {
    count: number;
    date: string;
};

type CompanyCount = {
    company: string;
    count: number;
};

type MonthCount = {
    month: string;
    count: number;
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

export function getMostIncidentsInOneDay(): BusiestDay {
    const counts = new Map<string, number>();
    let result: BusiestDay | null = null;

    for (const inc of incidents) {
        const count = (counts.get(inc.date) ?? 0) + 1;
        counts.set(inc.date, count);

        // incidents are sorted newest first
        // use latest in the case of a tie
        if (!result || count > result.count) {
            result = { count, date: inc.date };
        }
    }

    return result!;
}

export function getMostCommonlyAffectedCompanies(): CompanyCount[] {
    const companyCounts = new Map<string, number>();

    for (const incident of incidents) {
        if (!incident.company || incident.excludeFromCompanyStats) {
            continue;
        }

        const currentCount = companyCounts.get(incident.company) ?? 0;
        companyCounts.set(incident.company, currentCount + 1);
    }

    const companies = Array.from(companyCounts, ([company, count]) => ({
        company,
        count,
    }));

    return companies
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
}

export function getIncidentsPerMonth(): MonthCount[] {
    const relevant = incidents.filter((inc) => !inc.excludeFromDateGap);

    const newest = new Date(relevant[0].date);
    const oldest = new Date(relevant[relevant.length - 1].date);

    const current = new Date(Date.UTC(oldest.getUTCFullYear(), oldest.getUTCMonth(), 1));
    const result: MonthCount[] = [];

    while (current <= newest) {
        const month = current.toISOString().slice(0, 7);
        const count = relevant.filter((inc) => inc.date.startsWith(month)).length;

        result.push({ month, count });
        current.setUTCMonth(current.getUTCMonth() + 1);
    }

    return result;
}
