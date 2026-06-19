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
    MICROSOFT: "Microsoft",
} as const;

// keep this array sorted newest-first the first element 
// is always treated as the most recent incident
// consider having this automatically sorted by date
export const incidents: Incident[] = [
    {
        date: "2026-06-18",
        title: "Texas government data breach allowed hackers to steal 3 million driver's licenses and passports",
        company: "Texas State Government",
        description: "The breach also included email addresses, phone numbers, and residential addresses of the affected license holders",
        sourceUrl: "https://archive.is/gr5dD"
    },
    {
        date: "2026-06-17",
        title: "Mastra npm Org Compromised",
        company: "Mastra",
        description: "Multiple Packages Trojanized to Drop a Remote Payload via easy-day-js. Combined reach is over 28 million downloads a month",
        sourceUrl: "https://archive.is/wIoS0"
    },
    {
        date: "2026-06-16",
        title: "Critical Copilot vulnerability allowed hackers to steal 2FA code from users",
        company: COMPANY.MICROSOFT,
        description: "LLM Hackers bypassed guardrails via a Parameter-to-Prompt Injection using markdown",
        sourceUrl: "https://archive.is/Dg51w",
        additionalNotes: "Varonis has named the attack SearchLeak"
    },
    {
        date: "2026-06-11",
        title: "ShinyHunters hacked 100+ orgs by exploiting an Oracle PeopleSoft 0-day",
        company: "Multiple",
        description: "Data theft and extortion group ShinyHunters has exploited a critical Oracle PeopleSoft bug as a zero-day to compromise more than 100 organizations, including the University of Nottingham, across 300 vulnerable instances",
        sourceUrl: "https://archive.is/LQFw4",
        additionalNotes: "ShinyHunters actually have a spokesperson despite being a data theft group"
    },
    {
        date: "2026-06-10",
        title: "Angry bug hunter with Microsoft beef drops new Windows 0-day exploit",
        company: COMPANY.MICROSOFT,
        description: "Nightmare Eclipse, a former ex-employee of Microsoft continues their crusade against Microsoft",
        sourceUrl: "https://archive.is/Nwiva",
        additionalNotes: "The beef started as a result of Microsoft ignoring Nightmare Eclipse's bug reports"
    },
    {
        date: "2026-06-08",
        title: "New Shai-Hulud attack trojanizes 19 science-focused PyPI packages",
        company: "FOSS",
        description: "Hackers compromised 19 packages on the PyPI and extended to 37 malicious releases",
        sourceUrl: "https://archive.is/kJj94",
    },
    {
        date: "2026-06-08",
        title: "Microsoft packages laced with credential stealer",
        company: COMPANY.MICROSOFT,
        description: "The same account was compromised earlier in a similar incident",
        sourceUrl: "https://archive.is/GjfvX",
    },
    {
        date: "2026-06-06",
        title: "Group Hid Inside Microsoft 365 Networks for 2 years",
        company: COMPANY.MICROSOFT,
        description: "Chinese Threat Group Hid Inside Microsoft 365 Networks for 18 Months Using Secret Malware Arsenal",
        sourceUrl: "https://archive.is/1Yqtt",
    },
    {
        date: "2026-06-02",
        title: "Instagram AI Chatbot Hijacked",
        company: COMPANY.META,
        description: "Instagram AI chatbot gives access to high profile accounts simply by asking",
        sourceUrl: "https://archive.is/UNXGl",
        additionalNotes: "First known major example of AI chatbot hijacking"
    },
    {
        date: "2026-05-29",
        title: "Code-deleting malware in popular open source testing library",
        company: "FOSS/jqwik",
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
