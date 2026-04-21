import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import UniButton from '../../../core/components/UniButton';
import StatusBadge from '../../../core/components/StatusBadge';
import { useFeedStore } from '../../feed/store/useFeedStore';
import { FeedItem } from '../../feed/types';
import { RootStackParamList } from '../../../navigation/types';
import { RouteNames } from '../../../navigation/routeNames';
import { getDocument } from '../../../services/firestoreService';

type Props = NativeStackScreenProps<RootStackParamList, typeof RouteNames.ITEM_DETAIL>;

const ItemDetailScreen: React.FC<Props> = ({ route }) => {
  const { itemId } = route.params;
  const getItemById = useFeedStore((state) => state.getItemById);
  const [item, setItem] = useState<FeedItem | null>(getItemById(itemId) ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!item);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{
            uri:
              item.imageUrl ||
              'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.hero}
        />
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>
        <View style={styles.locationRow}>
          <MapPin size={18} color="#6B7280" strokeWidth={2.25} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Text style={styles.description}>{item.description || 'No description provided yet.'}</Text>
        <UniButton label="Message Finder" onPress={() => {}} />
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
    paddingBottom: 32,
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
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 16,
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
