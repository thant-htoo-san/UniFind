import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../../auth/store/useAuthStore';
import { useMessagesStore } from '../store/useMessagesStore';
import { MessagesStackParamList } from '../../../navigation/types';
import { RouteNames } from '../../../navigation/routeNames';
import { Conversation } from '../types';

type NavigationProp = NativeStackNavigationProp<MessagesStackParamList>;

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);
  const { conversations, subscribeToConversations, fetchConversations } = useMessagesStore(
    (state) => ({
      conversations: state.conversations,
      subscribeToConversations: state.subscribeToConversations,
      fetchConversations: state.fetchConversations,
    })
  );

  useEffect(() => {
    if (!user?.uid) return;

    // Fetch initial conversations
    fetchConversations(user.uid);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToConversations(user.uid);

    return () => unsubscribe();
  }, [user?.uid, fetchConversations, subscribeToConversations]);

  const handleOpenChat = (conversationId: string, otherUserName: string) => {
    navigation.navigate(RouteNames.CHAT_DETAIL, { conversationId, otherUserName });
  };

  const conversationList = Object.values(conversations).sort(
    (a, b) => b.lastMessageTime - a.lastMessageTime
  );

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const getOtherUserName = (conversation: Conversation): string => {
    const otherUserId = conversation.participants.find((id) => id !== user?.uid);
    return otherUserId ? conversation.participantNames[otherUserId] || 'Unknown' : 'Unknown';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Messages</Text>
      {conversationList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={conversationList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => handleOpenChat(item.id, getOtherUserName(item))}
            >
              <View style={styles.iconWrap}>
                <MessageCircle size={20} color="#0F172A" strokeWidth={2.25} />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.name}>{getOtherUserName(item)}</Text>
                <Text style={styles.preview} numberOfLines={1}>
                  {item.lastMessage || 'No messages yet'}
                </Text>
              </View>
              <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#6B7280',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  separator: {
    height: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default MessagesScreen;
