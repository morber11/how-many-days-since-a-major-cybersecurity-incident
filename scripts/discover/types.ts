export interface Article {
    source: string;
    title: string;
    url: string;
    date: string; // YYYY-MM-DD
    summary: string;
}

export interface Candidate {
    date: string; // YYYY-MM-DD
    title: string;
    companyKey: string;
    companyName: string;
    description: string;
    additionalNotes?: string;
    sourceUrl: string;
}

export interface NewEntry extends Candidate {
    archivedUrl?: string;
}
