export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  participants: string[]; // [userId1, userId2]
  participantNames: Record<string, string>; // { userId: userName }
  lastMessage: string;
  lastMessageTime: number;
  lastMessageSenderId: string;
  updatedAt: number;
};
