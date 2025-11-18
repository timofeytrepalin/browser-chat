export interface StorageError {
  code: string;
  message: string;
  original?: Error;
}

export class StorageService {
  private static readonly PREFIX = 'chat_';

  static getKey(name: string): string {
    return `${this.PREFIX}${name}`;
  }

  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(this.getKey(key), value);
    } catch (e) {
      if (e instanceof Error) {
        if (e.name === 'QuotaExceededError') {
          throw this.createError('QUOTA_EXCEEDED', 'LocalStorage quota exceeded', e);
        }
        throw this.createError('STORAGE_ERROR', e.message, e);
      }
      throw this.createError('UNKNOWN_ERROR', 'Unknown storage error');
    }
  }

  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(this.getKey(key));
    } catch (e) {
      throw this.createError('STORAGE_ERROR', 'Failed to read from storage', e instanceof Error ? e : undefined);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (e) {
      throw this.createError('STORAGE_ERROR', 'Failed to remove from storage', e instanceof Error ? e : undefined);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      throw this.createError('STORAGE_ERROR', 'Failed to clear storage', e instanceof Error ? e : undefined);
    }
  }

  private static createError(code: string, message: string, original?: Error): StorageError {
    return { code, message, original };
  }
}
