import type { Message, UserInfo } from '@/models/Message';

export function isMessage(obj: unknown): obj is Message {
  if (!obj || typeof obj !== 'object') return false;
  const msg = obj as Record<string, unknown>;
  return (
    typeof msg.id === 'number' &&
    typeof msg.text === 'string' &&
    typeof msg.status === 'boolean' &&
    msg.timestamp instanceof Date
  );
}

export function isUserInfo(obj: unknown): obj is UserInfo {
  if (!obj || typeof obj !== 'object') return false;
  const info = obj as Record<string, unknown>;
  return typeof info.name === 'string' && typeof info.id === 'string';
}

export function assertIsMessage(obj: unknown): asserts obj is Message {
  if (!isMessage(obj)) {
    throw new Error('Object is not a valid Message');
  }
}

export function assertIsUserInfo(obj: unknown): asserts obj is UserInfo {
  if (!isUserInfo(obj)) {
    throw new Error('Object is not a valid UserInfo');
  }
}
