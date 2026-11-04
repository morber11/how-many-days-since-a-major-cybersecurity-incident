import { describe, expect, it, vi } from "vitest";
import { withRotation } from "./rotation.ts";

class BusyError extends Error { }

const shouldRotate = (error: unknown): boolean => error instanceof BusyError;

describe("withRotation", () => {
    it("returns the first successful result without trying later candidates", async () => {
        const attempt = vi.fn(async (candidate: string) => `${candidate} result`);

        const result = await withRotation(["a", "b"], attempt, { shouldRotate });

        expect(result).toBe("a result");
        expect(attempt).not.toHaveBeenCalledWith("b");
    });

    it("moves to the next candidate when the error is rotatable", async () => {
        const busy = new BusyError("busy");
        const onRotate = vi.fn();
        const attempt = vi.fn(async (candidate: string) => {
            if (candidate === "a") {
                throw busy;
            }

            return "b result";
        });

        const result = await withRotation(["a", "b"], attempt, { shouldRotate, onRotate });

        expect(result).toBe("b result");
        expect(onRotate).toHaveBeenCalledWith("a", busy);
    });

    it("rethrows a non-rotatable error without trying other candidates", async () => {
        const failure = new Error("bad request");
        const attempt = vi.fn(async (_candidate: string): Promise<string> => {
            throw failure;
        });

        await expect(withRotation(["a", "b"], attempt, { shouldRotate })).rejects.toBe(failure);
        expect(attempt).not.toHaveBeenCalledWith("b");
    });

    it("throws the last error when every candidate is busy, without reporting a rotation past the last", async () => {
        const busyA = new BusyError("a is busy");
        const busyB = new BusyError("b is busy");
        const onRotate = vi.fn();
        const attempt = vi.fn(async (candidate: string): Promise<string> => {
            throw candidate === "a" ? busyA : busyB;
        });

        await expect(withRotation(["a", "b"], attempt, { shouldRotate, onRotate })).rejects.toBe(busyB);
        expect(onRotate).toHaveBeenCalledTimes(1);
        expect(onRotate).toHaveBeenCalledWith("a", busyA);
    });

    it("rejects an empty candidate list instead of throwing undefined", async () => {
        const attempt = vi.fn(async (_candidate: string) => "result");

        await expect(withRotation([], attempt, { shouldRotate })).rejects.toBeInstanceOf(Error);
    });
});
