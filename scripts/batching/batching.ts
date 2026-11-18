export function splitIntoBatches<T>(items: readonly T[], maxBatchSize: number, sizeOf: (item: T) => number): T[][] {
    const batches: T[][] = [];
    let batch: T[] = [];
    let batchSize = 0;

    for (const item of items) {
        const itemSize = sizeOf(item);

        if (batch.length > 0 && batchSize + itemSize > maxBatchSize) {
            batches.push(batch);
            batch = [];
            batchSize = 0;
        }

        batch.push(item);
        batchSize += itemSize;
    }

    if (batch.length > 0) {
        batches.push(batch);
    }

    return batches;
}
