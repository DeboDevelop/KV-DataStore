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

export async function retryWithDelay<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    func: (...args: any[]) => Promise<T>,
    maxAttempts: number,
    delay: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
    ): Promise<T> {
        try {
            return await func(...args); // Try calling the original function with the provided arguments
        } catch (error) {
            if (maxAttempts <= 1) {
                // No more attempts left, reject with the last error
                throw error;
            } else {
                // Wait for the specified delay and retry
                await new Promise<void>((resolve) => setTimeout(resolve, delay));
                return retryWithDelay(func, maxAttempts - 1, delay, ...args);
            }
        }
  }