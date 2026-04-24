import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';

import StatusBadge from '../../../core/components/StatusBadge';
import { FeedItem } from '../types';

interface FeedItemCardProps {
  item: FeedItem;
  onPress?: (item: FeedItem) => void;
}

const FeedItemCard: React.FC<FeedItemCardProps> = ({ item, onPress }) => {
  const postTypeLabel = item.postType === 'found' ? 'Found' : 'Lost';
  return (
    <Pressable onPress={() => onPress?.(item)} style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <Text style={styles.itemTitle}>{item.title}</Text>
      <View style={styles.locationRow}>
        <MapPin size={16} color="#6B7280" strokeWidth={2.25} />
        <Text style={styles.itemLocation}>{item.location}</Text>
      </View>
      <View style={styles.badgeRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{postTypeLabel}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  thumbnail: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  badgeRow: {
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
});

export default FeedItemCard;
