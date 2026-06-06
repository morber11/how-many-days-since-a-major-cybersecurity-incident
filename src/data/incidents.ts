export interface Incident {
    date: string; // YYYY-MM-DD
    title: string;
    company?: string;
    description: string;
    sourceUrl: string;
    additionalNotes?: string;
    excludeFromDateGap?: boolean;
}

// for well known companies we want to have a consistent name across incidents
const COMPANY = {
    META: "Meta (Facebook)",
    GITHUB: "Github (Microsoft)",
} as const;

// keep this array sorted newest-first the first element 
// is always treated as the most recent incident
// consider having this automatically sorted by date
export const incidents: Incident[] = [
    {
        date: "2026-06-06",
        title: "Group Hid Inside Microsoft 365 Networks for 2 years",
        company: "Microsoft",
        description: "Chinese Threat Group Hid Inside Microsoft 365 Networks for 18 Months Using Secret Malware Arsenal",
        sourceUrl: "https://archive.is/1Yqtt",
    },
    {
        date: "2026-06-02",
        title: "Instagram AI Chatbot Hijacked",
        company: COMPANY.META,
        description: "Instagram AI chatbot get access to high profile accounts simply by asking",
        sourceUrl: "https://archive.is/UNXGl",
        additionalNotes: "First known major example of AI chatbot hijacking"
    },
    {
        date: "2026-05-29",
        title: "Code-deleting malware in popular open source testing library",
        description: "A developer embedded a prompt injection attack in jqwik 1.10.0, a widely used Java testing library which directed AI coding agents to silently delete all jqwik tests and source files from any project running it",
        sourceUrl: "https://archive.is/YBdzp",
        additionalNotes: "First major example of AI prompt-injection in a supply chain attack"
    },
    {
        date: "2026-05-21",
        title: "Github Source Code Stolen",
        company: COMPANY.GITHUB,
        description: "Github breached after an employee's device was compromised via a Visual Studio Code Extension",
        sourceUrl: "https://archive.is/lIRES"
    }
    ,
    {
        date: "2026-05-18",
        title: "CISA digital keys stolen",
        company: 'U.S. Cybersecurity and Infrastructure Security Agency (CISA)',
        description: "CISA leave digital keys to cloud storage accounts in plain text .csv file in public Github repo",
        sourceUrl: "https://archive.is/niNcb"
    },
    {
        date: "1903-06-04",
        title: "The First Hack: Cracking Morse Code Signals",
        company: "The Wireless Telegraph & Signal Company",
        description: "Magician Nevil Maskelyne disrupted a wireless demonstration by tampering with the morse code signals",
        sourceUrl: "https://archive.is/BMtLT",
        excludeFromDateGap: true,
    }
];
