import { create } from 'zustand';
import { Message, Conversation } from '../types';
import { pushData, subscribeToData, getData, setData } from '../../../services/realtimeDbService';

type MessageStore = {
  conversations: Record<string, Conversation>;
  currentMessages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;

  // Fetch all conversations for a user
  fetchConversations: (userId: string) => Promise<void>;
  
  // Fetch messages for a specific conversation
  fetchMessages: (conversationId: string) => Promise<void>;
  
  // Send a message
  sendMessage: (
    conversationId: string,
    senderId: string,
    senderName: string,
    text: string
  ) => Promise<void>;
  
  // Get or create a conversation between two users
  getOrCreateConversation: (
    userId1: string,
    userName1: string,
    userId2: string,
    userName2: string
  ) => Promise<string>;

  // Subscribe to conversation updates
  subscribeToConversations: (userId: string) => () => void;
  
  // Subscribe to message updates
  subscribeToMessages: (conversationId: string) => () => void;
};

export const useMessagesStore = create<MessageStore>((set, get) => ({
  conversations: {},
  currentMessages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,

  fetchConversations: async (userId: string) => {
    set({ isLoadingConversations: true });
    try {
      const conversations = await getData<Record<string, Conversation>>(
        `conversations`
      );
      if (conversations) {
        // Filter conversations where user is a participant
        const userConversations = Object.entries(conversations).reduce(
          (acc, [id, conv]) => {
            if (conv.participants.includes(userId)) {
              acc[id] = conv;
            }
            return acc;
          },
          {} as Record<string, Conversation>
        );
        set({ conversations: userConversations });
      }
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoadingMessages: true });
    try {
      const messages = await getData<Record<string, Message>>(
        `messages/${conversationId}`
      );
      if (messages) {
        const messageArray = Object.entries(messages)
          .map(([id, msg]) => ({ ...msg, id }))
          .sort((a, b) => a.createdAt - b.createdAt);
        set({ currentMessages: messageArray });
      } else {
        set({ currentMessages: [] });
      }
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (
    conversationId: string,
    senderId: string,
    senderName: string,
    text: string
  ) => {
    // Push message to Firebase
    const messageId = await pushData<Omit<Message, 'id'>>(
      `messages/${conversationId}`,
      {
        conversationId,
        senderId,
        senderName,
        text,
      }
    );

    if (!messageId) throw new Error('Failed to send message');

    // Update conversation with last message
    const conversations = get().conversations;
    const conversation = conversations[conversationId];
    if (conversation) {
      const updatedConversation: Conversation = {
        ...conversation,
        lastMessage: text,
        lastMessageTime: Date.now(),
        lastMessageSenderId: senderId,
        updatedAt: Date.now(),
      };
      set({
        conversations: {
          ...conversations,
          [conversationId]: updatedConversation,
        },
      });

      // Update in Firebase
      await setData(`conversations/${conversationId}`, updatedConversation);
    }
  },

  getOrCreateConversation: async (
    userId1: string,
    userName1: string,
    userId2: string,
    userName2: string
  ) => {
    // Create a deterministic conversation ID
    const conversationId = [userId1, userId2].sort().join('_');

    // Check if conversation exists
    const existing = await getData<Conversation>(
      `conversations/${conversationId}`
    );
    if (existing) {
      return conversationId;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: conversationId,
      participants: [userId1, userId2],
      participantNames: {
        [userId1]: userName1,
        [userId2]: userName2,
      },
      lastMessage: '',
      lastMessageTime: Date.now(),
      lastMessageSenderId: '',
      updatedAt: Date.now(),
    };

    await setData(`conversations/${conversationId}`, newConversation);
    return conversationId;
  },

  subscribeToConversations: (userId: string) => {
    return subscribeToData(`conversations`, (data) => {
      if (data) {
        // Filter conversations where user is a participant
        const userConversations = Object.entries(data).reduce(
          (acc, [id, conv]) => {
            if (conv.participants.includes(userId)) {
              acc[id] = conv;
            }
            return acc;
          },
          {} as Record<string, Conversation>
        );
        set({ conversations: userConversations });
      }
    });
  },

  subscribeToMessages: (conversationId: string) => {
    return subscribeToData(`messages/${conversationId}`, (data) => {
      if (data) {
        const messageArray = Object.entries(data)
          .map(([id, msg]) => ({ ...msg, id }))
          .sort((a, b) => a.createdAt - b.createdAt);
        set({ currentMessages: messageArray });
      } else {
        set({ currentMessages: [] });
      }
    });
  },
}));
