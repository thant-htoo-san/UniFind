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
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ImagePlus } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../config/supabase';

import { AuthState, useAuthStore } from '../../auth/store/useAuthStore';
import { useMessagesStore } from '../store/useMessagesStore';
import { MessagesStackParamList } from '../../../navigation/types';
import { RouteNames } from '../../../navigation/routeNames';
import { Message } from '../types';

const SUPABASE_BUCKET = 'messages';

type Props = NativeStackScreenProps<MessagesStackParamList, typeof RouteNames.CHAT_DETAIL>;

const ChatDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { conversationId, otherUserName } = route.params;
  const user = useAuthStore((state: AuthState) => state.user);
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [debugNote, setDebugNote] = useState('');
  const trimmedMessage = messageText.trim();

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

  const uploadImageAsync = async (asset: ImagePicker.ImagePickerAsset, userId: string) => {
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const fileName = asset.fileName || '';
    const nameExtension = fileName.includes('.') ? fileName.split('.').pop() : '';
    const mimeExtension = asset.mimeType?.includes('/') ? asset.mimeType.split('/').pop() : '';
    const extension = (nameExtension || mimeExtension || 'jpg').toLowerCase();
    const filePath = `${conversationId}/${userId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, blob, {
        contentType: asset.mimeType || blob.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Upload failed');
    }

    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
    if (!data?.publicUrl) {
      throw new Error('Failed to get image URL');
    }

    return data.publicUrl;
  };

  const handlePickImage = async () => {
    if (!user?.uid) {
      setDebugNote('Login required');
      Alert.alert('Login required', 'Please log in again before sending images.');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setIsUploadingImage(true);
    try {
      const senderName = user.displayName || user.email?.split('@')[0] || 'User';
      const imageUrl = await uploadImageAsync(asset, user.uid);
      await sendMessage(conversationId, user.uid, senderName, '', imageUrl);
      setDebugNote('Image sent');
    } catch (error: any) {
      setDebugNote(error?.message || 'Image upload failed');
      Alert.alert('Upload failed', error?.message || 'Could not upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSendMessage = async () => {
    if (!trimmedMessage) {
      setDebugNote('Empty message');
      Alert.alert('Empty message', 'Please type a message first.');
      return;
    }
    if (!user?.uid) {
      setDebugNote('Login required');
      Alert.alert('Login required', 'Please log in again before sending messages.');
      return;
    }

    setIsSending(true);
    try {
      const senderName = user.displayName || user.email?.split('@')[0] || 'User';
      console.log('Sending message', { conversationId, senderId: user.uid, senderName });
      await sendMessage(conversationId, user.uid, senderName, trimmedMessage);
      setMessageText('');
      
    } catch (error: any) {
      setDebugNote(error?.message || 'Send failed');
      Alert.alert('Send failed', error?.message || 'Could not send message');
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
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
          ) : null}
          {item.text ? (
            <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
              {item.text}
            </Text>
          ) : null}
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          inverted={false}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          {debugNote ? <Text style={styles.debugText}>{debugNote}</Text> : null}
          <Pressable
            style={styles.imageButton}
            onPress={handlePickImage}
            disabled={isSending || isUploadingImage}
          >
            {isUploadingImage ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <ImagePlus size={20} color="#007AFF" strokeWidth={2.25} />
            )}
          </Pressable>
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
            style={[styles.sendButton, (!trimmedMessage || isSending) && styles.sendButtonDisabled]}
            onPress={() => {
              console.log('Send pressed');
              Alert.alert('Debug', 'Send pressed');
              handleSendMessage();
            }}
            hitSlop={8}
          >
            <Send
              size={20}
              color={trimmedMessage && !isSending ? '#007AFF' : '#9CA3AF'}
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
  list: {
    flex: 1,
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
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 6,
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
    zIndex: 2,
  },
  debugText: {
    position: 'absolute',
    top: 4,
    left: 16,
    right: 16,
    fontSize: 12,
    color: '#DC2626',
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#E5E7EB',
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
