import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ChevronLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuthStore } from '../../auth/store/useAuthStore';
import { useMessagesStore } from '../store/useMessagesStore';
import { RootStackParamList } from '../../../navigation/types';
import { RouteNames } from '../../../navigation/routeNames';
import { Message } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, typeof RouteNames.CHAT_DETAIL>;

const ChatDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { conversationId, otherUserName } = route.params;
  const user = useAuthStore((state) => state.user);
  const {
    currentMessages,
    sendMessage,
    fetchMessages,
    subscribeToMessages,
    isLoadingMessages,
  } = useMessagesStore((state) => ({
    currentMessages: state.currentMessages,
    sendMessage: state.sendMessage,
    fetchMessages: state.fetchMessages,
    subscribeToMessages: state.subscribeToMessages,
    isLoadingMessages: state.isLoadingMessages,
  }));

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Set header
    navigation.setOptions({
      headerShown: true,
      title: otherUserName,
      headerTintColor: '#007AFF',
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerTitleStyle: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '600',
      },
    });
  }, [navigation, otherUserName]);

  useEffect(() => {
    if (!conversationId) return;

    // Fetch initial messages
    fetchMessages(conversationId);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToMessages(conversationId);

    return () => unsubscribe();
  }, [conversationId, fetchMessages, subscribeToMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user?.uid || !user?.displayName) return;

    setIsSending(true);
    try {
      await sendMessage(conversationId, user.uid, user.displayName, messageText.trim());
      setMessageText('');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === user?.uid;

    return (
      <View style={[styles.messageRow, isOwn ? styles.ownMessage : styles.otherMessage]}>
        <View
          style={[
            styles.messageBubble,
            isOwn ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isOwn ? styles.ownTime : styles.otherTime]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoadingMessages && currentMessages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <FlatList
          data={currentMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          inverted={false}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={messageText}
            onChangeText={setMessageText}
            editable={!isSending}
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendButton, (!messageText.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSending}
          >
            <Send
              size={20}
              color={messageText.trim() && !isSending ? '#007AFF' : '#9CA3AF'}
              strokeWidth={2.25}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  ownText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#0F172A',
  },
  messageTime: {
    fontSize: 11,
  },
  ownTime: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  otherTime: {
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatDetailScreen;
