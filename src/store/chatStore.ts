import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Message, UserInfo } from '@/models/Message';
import { accident } from '@/utils';
import { StorageService } from '@/services/storage.service';
import { Logger } from '@/services/logger.service';

export interface ChatState {
  messages: Message[]
  userInfo: UserInfo
}

const STORAGE_KEY = 'history';

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([]);
  const userInfo = ref<UserInfo>({
    name: '',
    id: '',
  });

  const reversedMessages = computed(() => {
    return [...messages.value].reverse();
  });

  const userInfoComputed = computed(() => ({
    name: userInfo.value.name,
    id: userInfo.value.id,
  }));

  const stats = computed(() => ({
    total: messages.value.length,
    sent: messages.value.filter((m) => m.status).length,
    failed: messages.value.filter((m) => !m.status).length,
  }));

  function generateMessageId(): number {
    if (messages.value.length === 0) return 1;
    const ids = messages.value.map((msg) => msg.id);
    return Math.max(...ids) + 1;
  }

  function addMessage(text: string, status: boolean = true): Message {
    try {
      const msgObject = new Message(
        generateMessageId(),
        text,
        userInfoComputed.value,
        status
      );
      messages.value.push(msgObject);
      Logger.debug('Message added', { id: msgObject.id, status });
      return msgObject;
    } catch (error) {
      Logger.error('Failed to add message', error);
      throw error;
    }
  }

  function deleteMessage(messageId: number): void {
    const idx = messages.value.findIndex((msg) => msg.id === messageId);
    if (idx > -1) {
      messages.value.splice(idx, 1);
      Logger.debug('Message deleted', { messageId });
    }
  }

  function setUserInfo(name: string, id: string): void {
    try {
      userInfo.value.name = name.trim();
      userInfo.value.id = id;
      Logger.info('User info set', { name, id });
    } catch (error) {
      Logger.error('Failed to set user info', error);
      throw error;
    }
  }

  function saveState(): void {
    try {
      const validMsgs = messages.value.filter((msg) => msg.status);
      if (validMsgs.length === 0) {
        StorageService.removeItem(STORAGE_KEY);
      } else {
        const serialized = validMsgs.map((m) => m.toJSON());
        StorageService.setItem(STORAGE_KEY, JSON.stringify(serialized));
      }
      Logger.debug('State saved', { count: validMsgs.length });
    } catch (error) {
      Logger.error('Failed to save state', error);
    }
  }

  function loadState(): void {
    try {
      const history = StorageService.getItem(STORAGE_KEY);
      if (history) {
        const parsedMessages = JSON.parse(history) as Array<Record<string, unknown>>;
        messages.value = parsedMessages
          .map((msg) => Message.fromJSON(msg))
          .filter((m): m is Message => m !== null);
        Logger.info('State loaded', { count: messages.value.length });
      }
    } catch (error) {
      Logger.error('Failed to load state', error);
      messages.value = [];
    }
  }

  function clearHistory(): void {
    try {
      StorageService.removeItem(STORAGE_KEY);
      messages.value = [];
      Logger.info('History cleared');
    } catch (error) {
      Logger.error('Failed to clear history', error);
    }
  }

  function addExternalMessage(obj: unknown): void {
    try {
      const msg = Message.fromJSON(obj);
      if (msg) {
        const exists = messages.value.some((m) => m.id === msg.id);
        if (!exists) {
          messages.value.push(msg);
          Logger.debug('External message added', { id: msg.id });
        }
      }
    } catch (error) {
      Logger.error('Failed to add external message', error);
    }
  }

  async function sendMessage(text: string): Promise<Message> {
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!accident()) {
            resolve();
          } else {
            reject(new Error('accident'));
          }
        }, 800);
      });

      const msg = addMessage(text, true);
      saveState();
      Logger.info('Message sent successfully', { id: msg.id });
      return msg;
    } catch (err) {
      const msg = addMessage(text, false);
      Logger.warn('Message send failed', { id: msg.id, error: err });
      return msg;
    }
  }

  function retryFailedMessage(messageId: number): void {
    const msg = messages.value.find((m) => m.id === messageId);
    if (msg && msg.canRetry()) {
      Logger.info('Retrying message', { id: messageId });
    } else {
      Logger.warn('Cannot retry message', { id: messageId });
    }
  }

  return {
    messages,
    userInfo,
    reversedMessages,
    userInfoComputed,
    stats,
    addMessage,
    deleteMessage,
    setUserInfo,
    saveState,
    loadState,
    clearHistory,
    addExternalMessage,
    sendMessage,
    retryFailedMessage,
  };
});
