import { create } from 'zustand';

import { FEED_ITEMS } from '../data/items';
import { Category, FeedItem } from '../types';

const deriveCategories = (items: FeedItem[]): Category[] => {
  const unique: Record<string, string> = {};
  items.forEach((item) => {
    unique[item.categoryId] = item.categoryLabel;
  });

  const categories = Object.entries(unique).map(([id, label]) => ({ id, label }));
  return [{ id: 'all', label: 'All' }, ...categories];
};

type FeedState = {
  items: FeedItem[];
  categories: Category[];
  selectedCategoryId: string;
  setItems: (items: FeedItem[]) => void;
  selectCategory: (categoryId: string) => void;
  getFilteredItems: () => FeedItem[];
};

export const useFeedStore = create<FeedState>((set, get) => ({
  items: FEED_ITEMS,
  categories: deriveCategories(FEED_ITEMS),
  selectedCategoryId: 'all',
  setItems: (items) =>
    set(() => ({
      items,
      categories: deriveCategories(items),
      selectedCategoryId: 'all',
    })),
  selectCategory: (categoryId) => set(() => ({ selectedCategoryId: categoryId })),
  getFilteredItems: () => {
    const { items, selectedCategoryId } = get();
    if (selectedCategoryId === 'all') return items;
    return items.filter((item) => item.categoryId === selectedCategoryId);
  },
}));
