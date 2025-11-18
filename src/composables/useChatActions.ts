import { useChatStore } from '@/store/chatStore';
import { Logger } from '@/services/logger.service';

export function useChatActions() {
  const store = useChatStore();

  const sendMessage = async (text: string): Promise<void> => {
    try {
      await store.sendMessage(text);
      Logger.info('Message sent');
    } catch (error) {
      Logger.error('Failed to send message', error);
      throw error;
    }
  };

  const deleteFailedMessage = (messageId: number): void => {
    try {
      store.deleteMessage(messageId);
      Logger.info('Message deleted', { messageId });
    } catch (error) {
      Logger.error('Failed to delete message', error);
      throw error;
    }
  };

  const retryMessage = async (messageId: number, text: string): Promise<void> => {
    try {
      store.deleteMessage(messageId);
      await store.sendMessage(text);
      Logger.info('Message retry successful', { messageId });
    } catch (error) {
      Logger.error('Failed to retry message', error);
      throw error;
    }
  };

  const clearAllMessages = (): void => {
    try {
      store.clearHistory();
      Logger.info('All messages cleared');
    } catch (error) {
      Logger.error('Failed to clear messages', error);
      throw error;
    }
  };

  return {
    sendMessage,
    deleteFailedMessage,
    retryMessage,
    clearAllMessages,
  };
}
