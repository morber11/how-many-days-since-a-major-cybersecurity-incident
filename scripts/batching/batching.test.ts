import { describe, expect, it } from "vitest";
import { splitIntoBatches } from "./batching.ts";

const length = (item: string): number => item.length;

describe("splitIntoBatches", () => {
    it("keeps every item in order without going over the batch size", () => {
        const batches = splitIntoBatches(["aa", "bb", "c", "dddd", "e"], 4, length);

        expect(batches).toEqual([["aa", "bb"], ["c"], ["dddd"], ["e"]]);
    });
});
