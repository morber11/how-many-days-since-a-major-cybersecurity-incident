// for well known companies we want to have a consistent name across incidents
const COMPANY = {
    AMGEN: "Amgen",
    APOLLO_GLOBAL_MANAGEMENT: "Apollo Global Management",
    CEVA_LOGISTICS: "Ceva Logistics",
    CERT_POLSKA: "CERT Polska",
    CHICK_FIL_A: "Chick-fil-A",
    COLDCARD: "Coldcard",
    DAHUA: "Dahua",
    DHS: "DHS",
    FOSS: "FOSS",
    FOSS_JQWIK: "FOSS/jqwik",
    FRAMEWORK: "Framework",
    META: "Meta (Facebook)",
    GITHUB: "Github (Microsoft)",
    HUGGING_FACE: "Hugging Face",
    MASTRA: "Mastra",
    MINNESOTA_WATER_SYSTEMS: "Minnesota Water Systems",
    MICROSOFT: "Microsoft",
    MULTIPLE: "Multiple",
    MYDR: "MyDr",
    NIHON_KOTSU: "Nihon Kotsu",
    ORIGIN_ENERGY: "Origin Energy",
    RUST: "Rust",
    TEXAS_STATE_GOVERNMENT: "Texas State Government",
    THE_VATICAN: "The Vatican",
    UK_GOVERNMENT: "UK Government",
    US_CYBERSECURITY_AND_INFRASTRUCTURE_SECURITY_AGENCY: "U.S. Cybersecurity and Infrastructure Security Agency (CISA)",
    VARIOUS: "Various",
    WIRELESS_TELEGRAPH_AND_SIGNAL_COMPANY: "The Wireless Telegraph & Signal Company",
    ZOOM: "Zoom",
} as const;

type Company = typeof COMPANY[keyof typeof COMPANY];

export interface Incident {
    date: string; // YYYY-MM-DD
    title: string;
    company?: Company;
    description: string;
    sourceUrl: string;
    additionalNotes?: string;
    excludeFromDateGap?: boolean;
}

// keep this array sorted newest-first the first element 
// is always treated as the most recent incident
// consider having this automatically sorted by date
export const incidents: Incident[] = [
    {
        date: "2026-08-24",
        title: "Personal Information Exposed in Apollo Global Data Breach",
        company: COMPANY.APOLLO_GLOBAL_MANAGEMENT,
        description: "The private equity firm, which has roughly $1.05 trillion of assets under management, appears to be one of the victims of a campaign conducted by a cybercrime group tracked as UNC6671 and BlackFile. It's unclear how many individuals are affected by the data breach",
        sourceUrl: "https://archive.is/jG9N7",
    },
    {
        date: "2026-08-23",
        title: "Iranian hackers shut down UK power plant",
        company: COMPANY.UK_GOVERNMENT,
        description: "It is thought to be the first time that hackers affiliated to the Iranian regime have succeeded in closing down such a facility in the UK, and is believed to be the most successful cyber attack of its kind",
        sourceUrl: "https://archive.is/S8Ldm",
    },
    {
        date: "2026-08-20",
        title: "Rust Supply Chain Attack Puts Build-Time Malware in Crates with 245 Million Downloads",
        company: COMPANY.RUST,
        description: "The Rust Project has deleted malicious versions of three widely used Rust crates from crates.io after a compromised maintainer account published releases that added a typosquatted dependency whose build script downloaded and executed a remote payload during compilation",
        sourceUrl: "https://archive.is/CnhgC",
        additionalNotes: "Because the malicious code sat in the build script of the injected dependency, building a project that resolved it was sufficient to run the payload, and nothing from the crates themselves had to be called"
    },
    {
        date: "2026-08-19",
        title: "Hackers Compromised 14,500+ Dahua Devices Using Credential Attacks, Auth Bypasses, and P2P",
        company: COMPANY.DAHUA,
        description: "The activity, codenamed Operation CameraSwarm, was reconstructed from a 407 MB exposed working directory containing 2,616 files across 234 subdirectories, with the researchers saying confirmed compromises were concentrated in Ukraine and Russia",
        sourceUrl: "https://archive.is/ka37B",
    },
    {
        date: "2026-08-13",
        title: "Poland hit by theft of 19 million patients' data from medical platform",
        company: COMPANY.MYDR,
        description: "The personal data of almost 19 million people, including medical information, has been compromised in a major cyberattack on a company that provides services to thousands of medical facilities in Poland",
        sourceUrl: "https://archive.is/mvLcC",
        additionalNotes: "\"We are dealing with one of the largest incidents in Poland's history\" said digital affairs minister Krzysztof Gawkowski"
    },
    {
        date: "2026-08-11",
        title: "Hackers Breach Polish Power Plant Controls via Private Cellular Network and Shut Turbine",
        company: COMPANY.CERT_POLSKA,
        description: "Attackers shut down a steam turbine and the process-water treatment system at a Polish combined heat and power plant by coming in over the private cellular network the local grid operator uses to reach remote equipment",
        sourceUrl: "https://archive.is/an8ei",
        additionalNotes: "Investigators could not determine whether a vulnerability in the Teltonika router had been exploited, so there is no single software patch to apply"
    },
    {
        date: "2026-08-07",
        title: "Computer maker Framework notifies \"all customers\" of a data breach",
        company: COMPANY.FRAMEWORK,
        description: "The company was hacked by someone using an unknown zero-day security flaw. The hackers exploited the bug to give them the ability to access customers' databases stored on Metabase's cloud servers",
        sourceUrl: "https://archive.is/hvIXx",
        additionalNotes: "The company blamed the data breach on an upstream cyberattack at Metabase"
    },
    {
        date: "2026-08-06",
        title: "Cyberattack on Ceva Logistics warehouses in Europe impacts retailers",
        company: COMPANY.CEVA_LOGISTICS,
        description: "Operations at eight Ceva Logistics warehouses in Europe were disrupted over the weekend by a cyberattack, causing shipping delays for many of the freight giant's retail customers with inventory stored in those locations, according to a source close to the situation",
        sourceUrl: "https://archive.is/7IYQb",
        additionalNotes: "Valve Software were using Ceva Logistics to ship their products in Europe, and many customers were affected"
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
        company: COMPANY.COLDCARD,
        description: "Galaxy Research said the attack did not compromise wallets in the way exchange hacks or phishing scams typically do. Instead, the attacker exploited a vulnerable seed-generation process to derive private keys",
        sourceUrl: "https://archive.is/Zs0Ii",
        additionalNotes: "Reliability in Bitcoin as a reliable asset falls as a result of this incident"
    },
    {
        date: "2026-07-31",
        title: "Amgen says cloud data breach exposed patient health, proprietary info",
        company: COMPANY.AMGEN,
        description: "Pharmaceutical company Amgen says it suffered a data breach after threat actors stole corporate data and patient information stored in multiple cloud systems operated by third-party service providers",
        sourceUrl: "https://archive.is/ySa0q"
    },
    {
        date: "2026-07-31",
        title: "Anthropic's Claude breached 3 orgs, uploaded PyPI malware during tests",
        company: COMPANY.FOSS,
        description: "Anthropic said one of its Claude models built a malicious Python package and uploaded it to PyPI, where it ran on 15 real systems before the registry's automated defenses pulled it",
        sourceUrl: "https://archive.is/Ig6cK"
    },
    {
        date: "2026-07-29",
        title: "Hackers hit 30-plus Minnesota water systems in 48 hours",
        company: COMPANY.MINNESOTA_WATER_SYSTEMS,
        description: "A 48-hour cyberattack struck more than 30 Minnesota water systems. One plant shut down, and officials are still assessing water quality risks across the state",
        sourceUrl: "https://archive.is/Cyv0l"
    },
    {
        date: "2026-07-24",
        title: "Vatican's \"Click to Pray\" app leaks personal data",
        company: COMPANY.THE_VATICAN,
        description: "The app, which provides daily prayers and papal content, is used globally. Over 700,000 user accounts are exposed, with email addresses and names leaked in plaintext",
        sourceUrl: "https://archive.is/qQOz9"
    },
    {
        date: "2026-07-24",
        title: "Data Breach Confirmed After Australian Energy Giant Origin Is Hacked",
        company: COMPANY.ORIGIN_ENERGY,
        description: "The alleged hacker said the information of 2 million individuals will be leaked unless Origin pays a ransom. Origin Energy has roughly 4.8 million customers",
        sourceUrl: "https://archive.is/khmSh"
    },
    {
        date: "2026-07-23",
        title: "Chick-fil-A Accounts Get Fried in Credential Stuffing Attack",
        company: COMPANY.CHICK_FIL_A,
        description: "Threat actors used credentials obtained from other companies to hack into Chick-fil-A One royalty and rewards program",
        sourceUrl: "https://archive.is/g0T2z"
    },
    {
        date: "2026-07-20",
        title: "Hugging Face warns an autonomous AI agent hacked its network",
        company: COMPANY.HUGGING_FACE,
        description: "Attackers gained access to internal datasets and credentials after breaching its production infrastructure using an autonomous AI agent system",
        sourceUrl: "https://archive.is/hYS6t"
    },
    {
        date: "2026-07-18",
        title: "North Korean campaign uses fake coding interviews to steal developer credentials",
        company: COMPANY.VARIOUS,
        description: "Hackers hid malware inside SVG image files using steganography that allowewd them to steal developer credentials and gain access to their machines",
        sourceUrl: "https://archive.is/jJZcV",
        additionalNotes: "Not one antivirus vendor caught it"
    },
    {
        date: "2026-07-15",
        title: "Zoom warns of critical account takeover vulnerability",
        company: COMPANY.ZOOM,
        description: "Improper Input Validation in Zoom Desktop Client for Windows, Zoom VDI Client for Windows, and Zoom Meeting SDK for Windows may allow an unauthenticated user to conduct an account takeover via network access",
        sourceUrl: "https://archive.is/KXn8P"
    },
    {
        date: "2026-07-13",
        title: "Japan's largest taxi operator shuts systems after cyberattack",
        company: COMPANY.NIHON_KOTSU,
        description: "The incident occurred over the weekend, early Saturday morning, and impacted operations, including the company's taxi dispatch system, which remains offline as of today",
        sourceUrl: "https://archive.is/KZVxf"
    },
    {
        date: "2026-07-06",
        title: "Russian Hackers Breach UK Government Data, Trading It for Up to $60,000 on the Dark Web",
        company: COMPANY.UK_GOVERNMENT,
        description: "Russian hackers have infiltrated the email accounts of United Kingdom government officials and overseas Foreign Office staff in a major national security breach, according to a report by The Telegraph",
        sourceUrl: "https://archive.is/VpZJ7"
    },
    {
        date: "2026-06-30",
        title: "Hackers breached U.S. Department of Homeland Security information-sharing network",
        company: COMPANY.DHS,
        description: "A key database was accessed by an unknown threat actor potentially exposing sensitive data exchanged between federal, state, local and industry partners",
        sourceUrl: "https://archive.is/1FUCL"
    },
    {
        date: "2026-06-27",
        title: "Clean GitHub repo tricks AI coding agents into running malware",
        company: COMPANY.FOSS,
        description: "An innocuous python call to a shell script retrieved config values stored in a DNS TXT record",
        sourceUrl: "https://archive.is/6h3TR"
    },
    {
        date: "2026-06-19",
        title: "Malicious JetBrains Plugins Stole AI API Keys from 70,000 Developers",
        company: COMPANY.FOSS,
        description: "15 malicious JetBrains Marketplace plugins stole AI provider API keys from developers, then a remote kill-switch and marketplace purge removed the listings and banned the publisher accounts",
        sourceUrl: "https://archive.is/7C0PJ"
    },
    {
        date: "2026-06-18",
        title: "Texas government data breach allowed hackers to steal 3 million driver's licenses and passports",
        company: COMPANY.TEXAS_STATE_GOVERNMENT,
        description: "The breach also included email addresses, phone numbers, and residential addresses of the affected license holders",
        sourceUrl: "https://archive.is/gr5dD"
    },
    {
        date: "2026-06-17",
        title: "Mastra npm Org Compromised",
        company: COMPANY.MASTRA,
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
        company: COMPANY.MULTIPLE,
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
        company: COMPANY.FOSS,
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
        company: COMPANY.FOSS_JQWIK,
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
        company: COMPANY.US_CYBERSECURITY_AND_INFRASTRUCTURE_SECURITY_AGENCY,
        description: "CISA leave digital keys to cloud storage accounts in plain text .csv file in public Github repo",
        sourceUrl: "https://archive.is/niNcb"
    },
    {
        date: "1903-06-04",
        title: "The First Hack: Cracking Morse Code Signals",
        company: COMPANY.WIRELESS_TELEGRAPH_AND_SIGNAL_COMPANY,
        description: "Magician Nevil Maskelyne disrupted a wireless demonstration by tampering with the morse code signals",
        sourceUrl: "https://archive.is/BMtLT",
        excludeFromDateGap: true,
    }
];
