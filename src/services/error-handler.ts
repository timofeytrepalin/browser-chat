export enum ErrorType {
  VALIDATION = 'VALIDATION',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  readonly type: ErrorType;
  readonly originalError?: Error;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, originalError?: Error) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      return new AppError(error.message, ErrorType.VALIDATION, error);
    }
    if (error.message.includes('storage')) {
      return new AppError(error.message, ErrorType.STORAGE, error);
    }
  }

  const message = error instanceof Error ? error.message : String(error);
  return new AppError(message, ErrorType.UNKNOWN, error instanceof Error ? error : undefined);
}

export function isRecoverableError(error: unknown): boolean {
  const appError = handleError(error);
  return appError.type === ErrorType.NETWORK;
}
