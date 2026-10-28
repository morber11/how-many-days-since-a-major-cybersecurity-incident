<script lang="ts">
    import { COMPANY, incidents } from "../data/incidents";
    import { formatDate } from "../lib/counter";

    const pageSize = 8;
    const companies = Object.values(COMPANY);

    let search = $state("");
    let selectedCompany = $state("");
    let dateFrom = $state("");
    let dateTo = $state("");
    let currentPage = $state(1);

    let matchingIncidents = $derived(
        incidents.filter((inc) => {
            if (selectedCompany !== "" && inc.company !== selectedCompany) {
                return false;
            }

            if (dateFrom !== "" && inc.date < dateFrom) {
                return false;
            }

            if (dateTo !== "" && inc.date > dateTo) {
                return false;
            }

            const searchableText = [
                inc.title,
                inc.additionalNotes,
                inc.company,
            ].join(" ");

            return searchableText.toLowerCase().includes(search.toLowerCase());
        }),
    );

    let totalPages = $derived(Math.ceil(matchingIncidents.length / pageSize));

    let pageIncidents = $derived(
        matchingIncidents.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize,
        ),
    );

    function goToFirstPage() {
        currentPage = 1;
    }
</script>

<div class="archive-filters">
    <input
        type="search"
        placeholder="Search incidents"
        aria-label="Search incidents"
        bind:value={search}
        oninput={goToFirstPage}
    />

    <select
        aria-label="Filter by company"
        bind:value={selectedCompany}
        onchange={goToFirstPage}
    >
        <option value="">All companies</option>
        {#each companies as company}
            <option value={company}>{company}</option>
        {/each}
    </select>

    <div class="date-range">
        <input
            type="date"
            aria-label="From date"
            title="From date"
            max={dateTo}
            bind:value={dateFrom}
            oninput={goToFirstPage}
        />

        <span>to</span>

        <input
            type="date"
            aria-label="To date"
            title="To date"
            min={dateFrom}
            bind:value={dateTo}
            oninput={goToFirstPage}
        />
    </div>
</div>

{#if pageIncidents.length === 0}
    <p class="no-results">No incidents match</p>
{/if}

<table class="archive-table">
    <thead>
        <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Company</th>
            <th>Source</th>
        </tr>
    </thead>
    <tbody>
        {#each pageIncidents as inc}
            <tr>
                <td>{formatDate(inc.date)}</td>
                <td>
                    <span class="incident-title">{inc.title}</span>
                    {#if inc.additionalNotes}
                        <span class="incident-notes">{inc.additionalNotes}</span
                        >
                    {/if}
                </td>
                <td class="incident-company-cell">{inc.company ?? "N/A"}</td>
                <td>
                    <a
                        href={inc.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer">Source</a
                    >
                </td>
            </tr>
        {/each}
    </tbody>
</table>

{#if totalPages > 1}
    <div class="pagination">
        {#if currentPage > 1}
            <button onclick={() => currentPage--}>&larr; Previous</button>
        {/if}

        <span class="pagination-info">Page {currentPage} of {totalPages}</span>

        {#if currentPage < totalPages}
            <button onclick={() => currentPage++}>Next</button>
        {/if}
    </div>
{/if}

<style>
    .archive-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 0 0 1.5rem;
    }

    .archive-filters input[type="search"] {
        flex: 1 1 100%;
    }

    .archive-filters select {
        flex: 1;
        min-width: 10rem;
    }

    .date-range {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .date-range span {
        color: var(--color-text-muted);
        font-family: var(--font-mono);
        font-size: 0.85rem;
    }

    .archive-filters input,
    .archive-filters select {
        background: var(--color-surface);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
        padding: 0.4rem 0.6rem;
        font: inherit;
    }

    .archive-filters input[type="date"] {
        color-scheme: dark;
    }

    .no-results {
        color: var(--color-text-muted);
        font-style: italic;
    }

    .archive-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .archive-table th {
        font-family: var(--font-mono);
        text-align: left;
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-muted);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .archive-table td {
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid var(--color-border);
        vertical-align: top;
    }

    .archive-table tr:nth-child(even) td {
        background: #161616;
    }

    .archive-table td:first-child {
        font-family: var(--font-mono);
        white-space: nowrap;
        color: var(--color-text-muted);
        font-size: 0.85rem;
    }

    .archive-table .incident-title {
        font-weight: 600;
    }

    .archive-table .incident-company-cell {
        color: var(--color-text-muted);
        font-size: 0.85rem;
    }

    .archive-table .incident-notes {
        display: block;
        font-size: 0.8rem;
        font-style: italic;
        color: var(--color-text-muted);
        margin-top: 0.25rem;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        margin-top: 2rem;
        font-family: var(--font-mono);
        font-size: 0.85rem;
    }

    .pagination button {
        background: none;
        border: none;
        padding: 0;
        color: var(--color-accent);
        font: inherit;
        cursor: pointer;
    }

    .pagination button:hover {
        text-decoration: underline;
    }

    .pagination-info {
        color: var(--color-text-muted);
    }

    @media (max-width: 600px) {
        .archive-table th:nth-child(3),
        .archive-table td:nth-child(3) {
            display: none;
        }

        .archive-table {
            font-size: 0.8rem;
        }

        .date-range {
            flex-basis: 100%;
            min-width: 0;
        }

        .date-range input {
            flex: 1;
            min-width: 0;
        }
    }
</style>
