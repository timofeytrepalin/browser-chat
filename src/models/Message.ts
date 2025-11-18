export interface UserInfo {
  name: string;
  id: string;
}

export type MessageStatus = 'sent' | 'failed' | 'pending';

export class Message {
  readonly id: number;
  readonly text: string;
  readonly userInfo: UserInfo;
  readonly status: boolean;
  readonly timestamp: Date;
  readonly retryCount: number;

  constructor(
    id: number,
    text: string,
    userInfo: UserInfo,
    status: boolean = true,
    timestamp?: Date,
    retryCount: number = 0
  ) {
    this.id = id;
    this.text = this.validateText(text);
    this.userInfo = this.validateUserInfo(userInfo);
    this.status = status;
    this.timestamp = timestamp || new Date();
    this.retryCount = retryCount;
  }

  private validateText(text: string): string {
    const trimmed = String(text || '').trim();
    if (!trimmed) {
      throw new Error('Message text cannot be empty');
    }
    if (trimmed.length > 1000) {
      throw new Error('Message text cannot exceed 1000 characters');
    }
    return trimmed;
  }

  private validateUserInfo(info: unknown): UserInfo {
    if (!info || typeof info !== 'object') {
      throw new Error('Invalid user info');
    }
    const obj = info as Record<string, unknown>;
    return {
      name: String(obj.name || 'Anonymous'),
      id: String(obj.id || ''),
    };
  }

  static fromJSON(obj: unknown): Message | null {
    if (!obj || typeof obj !== 'object') return null;

    const record = obj as Record<string, unknown>;

    try {
      const id = typeof record.id === 'number' ? record.id : Number(record.id);
      const text = typeof record.text === 'string' ? record.text : String(record.text || '');
      const userInfo = record.userInfo && typeof record.userInfo === 'object'
        ? (record.userInfo as Record<string, unknown>)
        : {};

      const status = typeof record.status === 'boolean' ? record.status : Boolean(record.status);
      const timestamp = record.timestamp ? new Date(record.timestamp as string) : new Date();
      const retryCount = typeof record.retryCount === 'number' ? record.retryCount : 0;

      if (Number.isNaN(id) || !text) return null;

      return new Message(
        id,
        text,
        {
          name: String(userInfo.name || 'Anonymous'),
          id: String(userInfo.id || ''),
        },
        status,
        timestamp,
        retryCount
      );
    } catch {
      return null;
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      text: this.text,
      userInfo: this.userInfo,
      status: this.status,
      timestamp: this.timestamp.toISOString(),
      retryCount: this.retryCount,
    };
  }

  isOwnMessage(userId: string): boolean {
    return this.userInfo.id === userId;
  }

  isFailed(): boolean {
    return !this.status;
  }

  canRetry(): boolean {
    return this.isFailed() && this.retryCount < 3;
  }

  withRetryIncrement(): Message {
    return new Message(
      this.id,
      this.text,
      this.userInfo,
      this.status,
      this.timestamp,
      this.retryCount + 1
    );
  }
}
