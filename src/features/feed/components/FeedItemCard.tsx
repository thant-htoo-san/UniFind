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
  return (
    <Pressable onPress={() => onPress?.(item)} style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <Text style={styles.itemTitle}>{item.title}</Text>
      <View style={styles.locationRow}>
        <MapPin size={16} color="#6B7280" strokeWidth={2.25} />
        <Text style={styles.itemLocation}>{item.location}</Text>
      </View>
      <StatusBadge status={item.status} />
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
});

export default FeedItemCard;
