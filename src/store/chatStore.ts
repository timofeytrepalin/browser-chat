import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Message, UserInfo } from '@/models/Message';
import { accident } from '@/utils';

export interface ChatState {
  messages: Message[]
  userInfo: UserInfo
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([]);
  const userInfo = ref<UserInfo>({
    name: '',
    id: '',
  });

  const reversedMessages = computed<Message[]>(() => {
    return [...messages.value].reverse();
  });

  const userInfoComputed = computed<UserInfo>(() => ({
    name: userInfo.value.name,
    id: userInfo.value.id,
  }));

  function generateMessageId(): number {
    if (messages.value.length === 0) return 1;
    const ids = messages.value.map((msg: Message) => msg.id);
    return Math.max(...ids) + 1;
  }

  function addMessage(text: string, status: boolean = true): Message {
    const msgObject = new Message(
      generateMessageId(),
      text,
      userInfoComputed.value,
      status
    );
    messages.value.push(msgObject);
    return msgObject;
  }

  function deleteMessage(messageId: number): void {
    const index = messages.value.findIndex((msg: Message) => msg.id === messageId);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
  }

  function setUserInfo(name: string, id: string): void {
    userInfo.value.name = name;
    userInfo.value.id = id;
  }

  function saveState(): void {
    const validMessages = messages.value.filter((msg: Message) => msg.status);
    if (validMessages.length === 0) {
      localStorage.removeItem('history');
    } else {
      localStorage.setItem('history', JSON.stringify(validMessages));
    }
  }

  function loadState(): void {
    const history = localStorage.getItem('history');
    if (history) {
      try {
        const parsedMessages = JSON.parse(history) as Array<Record<string, unknown>>;
        messages.value = parsedMessages
          .map((msg) => Message.fromJSON(msg))
          .filter((m): m is Message => m !== null);
      } catch (e) {
        console.error('Failed to load chat history:', e);
        messages.value = [];
      }
    }
    localStorage.removeItem('message');
  }

  function clearHistory(): void {
    localStorage.removeItem('history');
  }

  function saveMessageToStorage(msgObject: Message): void {
    localStorage.setItem('message', JSON.stringify(msgObject));
  }

  function addExternalMessage(obj: unknown): void {
    const msg = Message.fromJSON(obj);
    if (msg) {
      messages.value.push(msg);
    }
  }

  async function sendMessage(text: string): Promise<Message> {
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!accident()) resolve();
          else reject(new Error('accident'));
        }, 800);
      });

      const msg = addMessage(text, true);
      saveMessageToStorage(msg);
      localStorage.removeItem('message');
      return msg;
    } catch (err) {
      const msg = addMessage(text, false);
      return msg;
    }
  }

  return {
    messages,
    userInfo,
    reversedMessages,
    userInfoComputed,
    addMessage,
    deleteMessage,
    setUserInfo,
    saveState,
    loadState,
    clearHistory,
    saveMessageToStorage,
    addExternalMessage,
    sendMessage,
  };
});
