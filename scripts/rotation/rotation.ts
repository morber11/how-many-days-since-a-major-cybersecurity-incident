export interface RotationOptions<T> {
    shouldRotate: (error: unknown) => boolean;
    onRotate?: (candidate: T, error: unknown) => void;
}

export async function withRotation<T, R>(
    candidates: readonly T[],
    attempt: (candidate: T) => Promise<R>,
    options: RotationOptions<T>,
): Promise<R> {
    if (candidates.length === 0) {
        throw new Error("no candidates to rotate through");
    }

    let lastError: unknown;

    for (const [index, candidate] of candidates.entries()) {
        try {
            return await attempt(candidate);
        } catch (error) {
            if (!options.shouldRotate(error)) {
                throw error;
            }

            lastError = error;

            if (index < candidates.length - 1) {
                options.onRotate?.(candidate, error);
            }
        }
    }

    throw lastError;
}
