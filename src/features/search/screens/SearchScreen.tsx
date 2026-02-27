import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FeedItemCard from '../../feed/components/FeedItemCard';
import { FeedItem } from '../../feed/types';
import { useFeedStore } from '../../feed/store/useFeedStore';

const SearchScreen: React.FC = () => {
  const { items } = useFeedStore((state) => ({ items: state.items }));
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item: FeedItem) =>
      [item.title, item.location, item.categoryLabel].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [items, query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Search Items</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by title, location, or category"
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.item_id}
        renderItem={({ item }) => (
          <View style={styles.itemSpacing}>
            <FeedItemCard item={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No matches found.</Text>}
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
