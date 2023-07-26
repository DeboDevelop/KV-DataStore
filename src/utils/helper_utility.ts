import { Result } from "../interfaces"
import { Status } from "../enums";

export function FailurePromise(message: string): Promise<Result> {
    return Promise.reject({
        status: Status.Failure,
        message,
    });
}

export function SuccessPromise(message: string): Promise<Result> {
    return Promise.resolve({
        status: Status.Success,
        message,
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function retryWithDelay<O extends Record<K, (...args: any[]) => any>, K extends keyof O, T>(
    obj: O,
    functionName: K,
    maxAttempts: number,
    delay: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
    ): Promise<T> {
        try {
            return await obj[functionName](...args);
        } catch (error) {
            if (maxAttempts <= 1) {
                // No more attempts left, reject with the last error
                throw error;
            } else {
                // Wait for the specified delay and retry
                await new Promise<void>((resolve) => setTimeout(resolve, delay));
                return retryWithDelay(obj, functionName, maxAttempts - 1, delay, ...args);
            }
        }
  }