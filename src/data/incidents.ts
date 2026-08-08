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
        date: "2026-08-07",
        title: "Computer maker Framework notifies \"all customers\" of a data breach",
        company: "Framework",
        description: "The company was hacked by someone using an unknown zero-day security flaw. The hackers exploited the bug to give them the ability to access customers' databases stored on Metabase's cloud servers",
        sourceUrl: "https://archive.is/hvIXx",
        additionalNotes: "The company blamed the data breach on an upstream cyberattack at Metabase"
    },
    {
        date: "2026-08-06",
        title: "Meta AI Hacked External Systems During Cybersecurity Testing",
        company: COMPANY.META,
        description: "The tested AI models were inadvertently allowed to access the internet due to a misconfiguration, which led them to exploit a vulnerability in an unnamed third-party service. It's unclear if it was a known flaw or a zero-day",
        sourceUrl: "https://archive.is/WOAfr",
        additionalNotes: "The incident involved a testing environment set up by Irregular, similar to what Anthropic reported last week"
    },
    {
        date: "2026-08-01",
        title: "Coldcard Seed-Flaw Hack Drains 1,082 Bitcoin From 1,196 Cold Wallets",
        company: "Coldcard",
        description: "Galaxy Research said the attack did not compromise wallets in the way exchange hacks or phishing scams typically do. Instead, the attacker exploited a vulnerable seed-generation process to derive private keys",
        sourceUrl: "https://archive.is/Zs0Ii",
        additionalNotes: "Reliability in Bitcoin as a reliable asset falls as a result of this incident"
    },
    {
        date: "2026-07-31",
        title: "Amgen says cloud data breach exposed patient health, proprietary info",
        company: "Amgen",
        description: "Pharmaceutical company Amgen says it suffered a data breach after threat actors stole corporate data and patient information stored in multiple cloud systems operated by third-party service providers",
        sourceUrl: "https://archive.is/ySa0q"
    },
    {
        date: "2026-07-31",
        title: "Anthropic's Claude breached 3 orgs, uploaded PyPI malware during tests",
        company: "FOSS",
        description: "Anthropic said one of its Claude models built a malicious Python package and uploaded it to PyPI, where it ran on 15 real systems before the registry's automated defenses pulled it",
        sourceUrl: "https://archive.is/Ig6cK"
    },
    {
        date: "2026-07-29",
        title: "Hackers hit 30-plus Minnesota water systems in 48 hours",
        company: "Minnesota Water Systems",
        description: "A 48-hour cyberattack struck more than 30 Minnesota water systems. One plant shut down, and officials are still assessing water quality risks across the state",
        sourceUrl: "https://archive.is/Cyv0l"
    },
    {
        date: "2026-07-24",
        title: "Vatican's \"Click to Pray\" app leaks personal data",
        company: "The Vatican",
        description: "The app, which provides daily prayers and papal content, is used globally. Over 700,000 user accounts are exposed, with email addresses and names leaked in plaintext",
        sourceUrl: "https://archive.is/qQOz9"
    },
    {
        date: "2026-07-24",
        title: "Data Breach Confirmed After Australian Energy Giant Origin Is Hacked",
        company: "Origin Energy",
        description: "The alleged hacker said the information of 2 million individuals will be leaked unless Origin pays a ransom. Origin Energy has roughly 4.8 million customers",
        sourceUrl: "https://archive.is/khmSh"
    },
    {
        date: "2026-07-23",
        title: "Chick-fil-A Accounts Get Fried in Credential Stuffing Attack",
        company: "Chick-fil-A",
        description: "Threat actors used credentials obtained from other companies to hack into Chick-fil-A One royalty and rewards program",
        sourceUrl: "https://archive.is/g0T2z"
    },
    {
        date: "2026-07-20",
        title: "Hugging Face warns an autonomous AI agent hacked its network",
        company: "Hugging Face",
        description: "Attackers gained access to internal datasets and credentials after breaching its production infrastructure using an autonomous AI agent system",
        sourceUrl: "https://archive.is/hYS6t"
    },
    {
        date: "2026-07-18",
        title: "North Korean campaign uses fake coding interviews to steal developer credentials",
        company: "Various",
        description: "Hackers hid malware inside SVG image files using steganography that allowewd them to steal developer credentials and gain access to their machines",
        sourceUrl: "https://archive.is/jJZcV",
        additionalNotes: "Not one antivirus vendor caught it"
    },
    {
        date: "2026-07-15",
        title: "Zoom warns of critical account takeover vulnerability",
        company: "Zoom",
        description: "Improper Input Validation in Zoom Desktop Client for Windows, Zoom VDI Client for Windows, and Zoom Meeting SDK for Windows may allow an unauthenticated user to conduct an account takeover via network access",
        sourceUrl: "https://archive.is/KXn8P"
    },
    {
        date: "2026-07-13",
        title: "Japan's largest taxi operator shuts systems after cyberattack",
        company: "Nihon Kotsu",
        description: "The incident occurred over the weekend, early Saturday morning, and impacted operations, including the company's taxi dispatch system, which remains offline as of today",
        sourceUrl: "https://archive.is/KZVxf"
    },
    {
        date: "2026-07-06",
        title: "Russian Hackers Breach UK Government Data, Trading It for Up to $60,000 on the Dark Web",
        company: "UK Government",
        description: "Russian hackers have infiltrated the email accounts of United Kingdom government officials and overseas Foreign Office staff in a major national security breach, according to a report by The Telegraph",
        sourceUrl: "https://archive.is/VpZJ7"
    },
    {
        date: "2026-06-30",
        title: "Hackers breached U.S. Department of Homeland Security information-sharing network",
        company: "DHS",
        description: "A key database was accessed by an unknown threat actor potentially exposing sensitive data exchanged between federal, state, local and industry partners",
        sourceUrl: "https://archive.is/1FUCL"
    },
    {
        date: "2026-06-27",
        title: "Clean GitHub repo tricks AI coding agents into running malware",
        company: "FOSS",
        description: "An innocuous python call to a shell script retrieved config values stored in a DNS TXT record",
        sourceUrl: "https://archive.is/6h3TR"
    },
    {
        date: "2026-06-19",
        title: "Malicious JetBrains Plugins Stole AI API Keys from 70,000 Developers",
        company: "FOSS",
        description: "15 malicious JetBrains Marketplace plugins stole AI provider API keys from developers, then a remote kill-switch and marketplace purge removed the listings and banned the publisher accounts",
        sourceUrl: "https://archive.is/7C0PJ"
    },
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
