import React from 'react';
import { FlatList, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';

import { Category } from '../types';

interface CategoryCarouselProps {
  categories: Category[];
  selectedCategoryId: string;
  onCategoryChange?: (category: Category) => void;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
}) => {
  const handlePress = (category: Category) => {
    onCategoryChange?.(category);
  };

  const renderItem = ({ item }: ListRenderItemInfo<Category>) => {
    const isActive = item.id === selectedCategoryId;
    return <CategoryChip category={item} isActive={isActive} onPress={() => handlePress(item)} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

interface CategoryChipProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category, isActive, onPress }) => {
  return (
    <Pressable onPress={onPress} style={[styles.chip, isActive ? styles.activeChip : styles.inactiveChip]}>
      <Text style={[styles.chipLabel, isActive ? styles.activeLabel : styles.inactiveLabel]}>
        {category.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 8,
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: '#007AFF',
  },
  inactiveChip: {
    backgroundColor: '#F2F2F2',
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
  inactiveLabel: {
    color: '#0F172A',
  },
});

export default CategoryCarousel;
