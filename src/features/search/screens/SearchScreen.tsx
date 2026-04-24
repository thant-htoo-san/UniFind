import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import FeedItemCard from '../../feed/components/FeedItemCard';
import { FeedItem, PostType } from '../../feed/types';
import { useFeedStore } from '../../feed/store/useFeedStore';
import { RootStackParamList } from '../../../navigation/types';
import { RouteNames } from '../../../navigation/routeNames';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, loadItems, isLoading } = useFeedStore((state) => ({
    items: state.items,
    loadItems: state.loadItems,
    isLoading: state.isLoading,
  }));
  const [query, setQuery] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState<'all' | PostType>('all');

  useEffect(() => {
    const unsubscribe = loadItems();
    return unsubscribe;
  }, [loadItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byQuery = !q
      ? items
      : items.filter((item: FeedItem) =>
          [item.title, item.location, item.categoryLabel].some((field) =>
            field.toLowerCase().includes(q)
          )
        );
    if (postTypeFilter === 'all') return byQuery;
    return byQuery.filter((item) => item.postType === postTypeFilter);
  }, [items, query, postTypeFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Search Items</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by title, location, or category"
        style={styles.input}
      />
      <View style={styles.filterRow}>
        {(['all', 'lost', 'found'] as const).map((type) => {
          const isActive = postTypeFilter === type;
          return (
            <Pressable
              key={type}
              onPress={() => setPostTypeFilter(type)}
              style={[styles.filterChip, isActive ? styles.filterChipActive : styles.filterChipInactive]}
            >
              <Text style={[styles.filterText, isActive ? styles.filterTextActive : styles.filterTextInactive]}>
                {type === 'all' ? 'All' : type === 'lost' ? 'Lost' : 'Found'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.item_id}
        renderItem={({ item }) => (
          <View style={styles.itemSpacing}>
            <FeedItemCard
              item={item}
              onPress={(selected) => navigation.navigate(RouteNames.ITEM_DETAIL, { itemId: selected.item_id })}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>{isLoading ? 'Loading items...' : 'No matches found.'}</Text>
        }
        showsVerticalScrollIndicator={false}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
  },
  filterChipInactive: {
    backgroundColor: '#E5E7EB',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterTextInactive: {
    color: '#111827',
  },
  itemSpacing: {
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
  },
});

export default SearchScreen;
