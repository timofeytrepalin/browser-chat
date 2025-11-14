export interface UserInfo {
  name: string
  id: string
}

export class Message {
  id: number;
  text: string;
  userInfo: UserInfo;
  status: boolean;

  constructor(
    id: number,
    text: string,
    userInfo: UserInfo,
    status: boolean = true
  ) {
    this.id = id;
    this.text = text;
    this.userInfo = userInfo;
    this.status = status;
  }

  static fromJSON(obj: unknown): Message | null {
    if (!obj || typeof obj !== 'object') return null;
    const id = typeof obj.id === 'number' ? obj.id : Number(obj.id);
    const text = typeof obj.text === 'string' ? obj.text : String(obj.text || '');
    const userInfo = obj.userInfo && typeof obj.userInfo === 'object'
      ? { name: String(obj.userInfo.name || ''), id: String(obj.userInfo.id || '') }
      : { name: '', id: '' };
    const status = typeof obj.status === 'boolean' ? obj.status : Boolean(obj.status);

    if (Number.isNaN(id) || !text) return null;

    return new Message(id, text, userInfo, status);
  }
}
