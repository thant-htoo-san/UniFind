import React, { useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryCarousel from '../components/CategoryCarousel';
import FeedItemCard from '../components/FeedItemCard';
import { Category, FeedItem } from '../types';
import { useFeedStore } from '../store/useFeedStore';
import { RootStackParamList } from '../../../navigation/types';
import { RouteNames } from '../../../navigation/routeNames';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { categories, selectedCategoryId, selectCategory, getFilteredItems, loadItems, isLoading, error } = useFeedStore((state) => ({
    categories: state.categories,
    selectedCategoryId: state.selectedCategoryId,
    selectCategory: state.selectCategory,
    getFilteredItems: state.getFilteredItems,
    loadItems: state.loadItems,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const items = useMemo(() => getFilteredItems(), [getFilteredItems, selectedCategoryId]);

  useEffect(() => {
    const unsubscribe = loadItems();
    return unsubscribe;
  }, [loadItems]);

  const handleCategoryChange = (category: Category) => {
    selectCategory(category.id);
  };

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 && styles.cardWrapperLeft]}>
      <FeedItemCard
        item={item}
        onPress={(selected) => navigation.navigate(RouteNames.ITEM_DETAIL, { itemId: selected.item_id })}
      />
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

      {isLoading && <Text style={styles.infoText}>Loading items...</Text>}
      {!isLoading && !!error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.item_id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!isLoading ? <Text style={styles.infoText}>No items posted yet.</Text> : null}
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
  infoText: {
    textAlign: 'center',
    color: '#64748B',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#DC2626',
    marginVertical: 8,
    paddingHorizontal: 16,
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
