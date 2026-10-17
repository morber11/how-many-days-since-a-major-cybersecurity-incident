import Parser from "rss-parser";
import type { Article } from "./types.ts";

interface Feed {
    url: string;
    paged: boolean;
}

const FEEDS: Feed[] = [
    { url: "https://www.bleepingcomputer.com/feed/", paged: false },
    { url: "https://therecord.media/feed", paged: false },
    { url: "https://www.securityweek.com/feed/", paged: true },
    { url: "https://krebsonsecurity.com/feed/", paged: false },
    { url: "https://feeds.feedburner.com/TheHackersNews", paged: false },
    { url: "https://databreaches.net/feed/", paged: true },
    { url: "https://techcrunch.com/category/security/feed/", paged: true },
    { url: "https://www.404media.co/rss/", paged: false },
];

const MAX_PAGES = 10;
const ARBITRARY_FAR_FUTURE_DATE = "9999-12-31";

const parser = new Parser({ headers: { "User-Agent": "hmdsamci-discover" }, timeout: 20000 });

function oldestDate(articles: Article[]): string {
    return articles.reduce((min, a) => (a.date < min ? a.date : min), ARBITRARY_FAR_FUTURE_DATE);
}

async function fetchFeed(feed: Feed, from: string): Promise<Article[]> {
    let articles: Article[] = [];

    try {
        for (let page = 1; page <= MAX_PAGES; page++) {
            const pageUrl = page === 1 ? feed.url : `${feed.url}?paged=${page}`;
            const { title: feedTitle, items } = await parser.parseURL(pageUrl);

            const pageArticles = items.flatMap((item) => {
                if (!item.link || !item.title || !item.isoDate) {
                    return [];
                }

                return [{
                    source: feedTitle ?? feed.url,
                    title: item.title,
                    url: item.link,
                    date: item.isoDate.slice(0, 10),
                    summary: (item.contentSnippet ?? "").slice(0, 1500),
                }];
            });

            articles = articles.concat(pageArticles);

            if (!feed.paged || pageArticles.length === 0 || oldestDate(articles) < from) {
                break;
            }
        }
    } catch (error) {
        console.warn(`skipping ${feed.url}: ${error}`);
        return [];
    }

    if (articles.length > 0 && oldestDate(articles) > from) {
        console.warn(`${feed.url} only has articles from ${oldestDate(articles)} onwards`);
    }

    return articles;
}

export async function fetchArticles(from: string, to: string): Promise<Article[]> {
    const feedResults = await Promise.all(FEEDS.map((feed) => fetchFeed(feed, from)));

    const articlesByUrl = new Map<string, Article>();

    for (const article of feedResults.flat()) {
        if (article.date >= from && article.date <= to) {
            articlesByUrl.set(article.url, article);
        }
    }

    return Array.from(articlesByUrl.values());
}
