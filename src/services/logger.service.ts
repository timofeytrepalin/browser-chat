export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: unknown;
}

export class Logger {
  private static logs: LogEntry[] = [];
  private static readonly MAX_LOGS = 100;

  static debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  static info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  static warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  static error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  private static log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    const style = this.getStyle(level);
    console.log(`%c[${level.toUpperCase()}] ${message}`, style, data);
  }

  private static getStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #888; font-size: 12px;',
      info: 'color: #0066cc; font-size: 12px;',
      warn: 'color: #ff8800; font-size: 12px; font-weight: bold;',
      error: 'color: #cc0000; font-size: 12px; font-weight: bold;',
    };
    return styles[level];
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}
