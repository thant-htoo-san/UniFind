import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import UniButton from '../../../core/components/UniButton';
import StatusBadge from '../../../core/components/StatusBadge';
import { useFeedStore } from '../../feed/store/useFeedStore';
import { AuthState, useAuthStore } from '../../auth/store/useAuthStore';
import { useMessagesStore } from '../../messages/store/useMessagesStore';
import { FeedItem } from '../../feed/types';
import { RootStackParamList } from '../../../navigation/types';
import { RouteNames } from '../../../navigation/routeNames';
import { getDocument, updateDocument } from '../../../services/firestoreService';

type Props = NativeStackScreenProps<RootStackParamList, typeof RouteNames.ITEM_DETAIL>;

const ItemDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const user = useAuthStore((state: AuthState) => state.user);
  const getItemById = useFeedStore((state) => state.getItemById);
  const getOrCreateConversation = useMessagesStore((state) => state.getOrCreateConversation);

  const [item, setItem] = useState<FeedItem | null>(getItemById(itemId) ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!item);
  const [posterName, setPosterName] = useState<string>('');
  const [isMessaging, setIsMessaging] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fromStore = getItemById(itemId);
    if (fromStore) {
      setItem(fromStore);
      setIsLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const doc = await getDocument<Omit<FeedItem, 'item_id'>>('items', itemId);
        if (!isMounted) return;
        if (doc) {
          setItem({
            item_id: doc.id,
            title: doc.title,
            location: doc.location,
            description: doc.description,
            status: doc.status,
            postType: doc.postType ?? 'lost',
            imageUrl: doc.imageUrl,
            categoryId: doc.categoryId,
            categoryLabel: doc.categoryLabel,
            createdBy: doc.createdBy,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [getItemById, itemId]);

  useEffect(() => {
    const createdBy = item?.createdBy;
    if (!createdBy) return;

    const fetchPosterName = async () => {
      try {
        const userDoc = await getDocument<{ displayName?: string; email?: string }>(
          'users',
          createdBy
        );
        if (userDoc?.displayName) {
          setPosterName(userDoc.displayName);
        } else if (userDoc?.email) {
          setPosterName(userDoc.email.split('@')[0]);
        } else {
          setPosterName('User');
        }
      } catch (error) {
        console.error('Failed to fetch poster name:', error);
        setPosterName('User');
      }
    };

    fetchPosterName();
  }, [item?.createdBy]);

  const handleMessageFinder = async () => {
    if (!user?.uid || !user?.displayName) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    const createdBy = item?.createdBy;
    if (!createdBy) {
      Alert.alert('Error', 'Could not find item poster');
      return;
    }

    if (user.uid === createdBy) {
      Alert.alert('Info', 'You cannot message yourself — you posted this item.');
      return;
    }

    setIsMessaging(true);
    try {
      const conversationId = await getOrCreateConversation(
        user.uid,
        user.displayName,
        createdBy,
        posterName || 'User'
      );

      navigation.navigate(RouteNames.MAIN_TABS, {
        screen: RouteNames.MESSAGES,
        params: {
          screen: RouteNames.CHAT_DETAIL,
          params: {
            conversationId,
            otherUserName: posterName || 'User',
          },
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to start conversation');
    } finally {
      setIsMessaging(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!item) return;

    const nextStatus = item.status === 'unclaimed' ? 'claimed' : 'unclaimed';
    setIsUpdatingStatus(true);
    try {
      await updateDocument('items', item.item_id, { status: nextStatus });
      setItem({ ...item, status: nextStatus });
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading item...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No item selected.</Text>
      </View>
    );
  }

  const isOwnItem = user?.uid === item.createdBy;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"   // ✅ Fix: allows button taps even after keyboard interaction
        scrollEventThrottle={16}
      >
        <Image
          source={{
            uri:
              item.imageUrl ||
              'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.hero}
          resizeMode="cover"
        />
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.headerBadges}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{item.postType === 'found' ? 'Found' : 'Lost'}</Text>
            </View>
            <StatusBadge status={item.status} />
          </View>
        </View>
        <View style={styles.locationRow}>
          <MapPin size={18} color="#6B7280" strokeWidth={2.25} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Text style={styles.description}>
          {item.description || 'No description provided yet.'}
        </Text>

        {/* Hide button if user is the item owner */}
        {!isOwnItem && (
          <UniButton
            label={isMessaging ? 'Opening chat...' : 'Message Finder'}
            onPress={handleMessageFinder}
            disabled={isMessaging}
          />
        )}

        {isOwnItem && (
          <View>
            <UniButton
              label={isUpdatingStatus ? 'Updating status...' : item.status === 'unclaimed' ? 'Mark as Claimed' : 'Mark as Unclaimed'}
              onPress={handleToggleStatus}
              disabled={isUpdatingStatus}
            />
            <Text style={styles.ownItemNote}>This is your posted item.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  hero: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 24,
  },
  ownItemNote: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    color: '#6B7280',
  },
});

export default ItemDetailScreen;