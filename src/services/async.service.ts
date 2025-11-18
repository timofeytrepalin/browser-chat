interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 800,
  maxDelay: 5000,
  backoffMultiplier: 2,
};

export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | undefined;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === config.maxAttempts) break;

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }

  throw lastError || new Error('Retry failed');
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateNonEmpty(value: string, fieldName: string): string {
  const trimmed = String(value).trim();
  if (!trimmed) {
    throw new ValidationError(`${fieldName} cannot be empty`);
  }
  return trimmed;
}

export function validateLength(value: string, max: number, fieldName: string): string {
  if (value.length > max) {
    throw new ValidationError(`${fieldName} cannot exceed ${max} characters`);
  }
  return value;
}
