import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryCarousel from '../components/CategoryCarousel';
import FeedItemCard from '../components/FeedItemCard';
import { Category, FeedItem } from '../types';
import { useFeedStore } from '../store/useFeedStore';

const HomeScreen: React.FC = () => {
  const { categories, selectedCategoryId, selectCategory, getFilteredItems } = useFeedStore((state) => ({
    categories: state.categories,
    selectedCategoryId: state.selectedCategoryId,
    selectCategory: state.selectCategory,
    getFilteredItems: state.getFilteredItems,
  }));

  const items = useMemo(() => getFilteredItems(), [getFilteredItems, selectedCategoryId]);

  const handleCategoryChange = (category: Category) => {
    selectCategory(category.id);
  };

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 && styles.cardWrapperLeft]}>
      <FeedItemCard item={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.appName}>UniFind</Text>
      </View>

      <CategoryCarousel
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.item_id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  cardWrapperLeft: {
    marginRight: 12,
  },
});

export default HomeScreen;
