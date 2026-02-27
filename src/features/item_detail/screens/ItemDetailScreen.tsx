import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';

import UniButton from '../../../core/components/UniButton';
import StatusBadge from '../../../core/components/StatusBadge';
import { useFeedStore } from '../../feed/store/useFeedStore';

const ItemDetailScreen: React.FC = () => {
  const { items } = useFeedStore((state) => ({ items: state.items }));
  const item = items[0];

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
        <Image source={{ uri: item.imageUrl }} style={styles.hero} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>
        <View style={styles.locationRow}>
          <MapPin size={18} color="#6B7280" strokeWidth={2.25} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Text style={styles.description}>
          This is a placeholder description. Add more details about the item to help the owner confirm
          it is theirs — stickers, engravings, or where it was found.
        </Text>
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
