import { create } from 'zustand';

import { addDocument, orderBy, subscribeToCollection } from '../../../services/firestoreService';
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
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  hasLoaded: boolean;
  setItems: (items: FeedItem[]) => void;
  selectCategory: (categoryId: string) => void;
  loadItems: () => () => void;
  createItem: (item: Omit<FeedItem, 'item_id'>) => Promise<string>;
  getItemById: (itemId: string) => FeedItem | undefined;
  getFilteredItems: () => FeedItem[];
};

type FirestoreItemDoc = Omit<FeedItem, 'item_id'> & { id: string };

const mapDocToFeedItem = (doc: FirestoreItemDoc): FeedItem => ({
  item_id: doc.id,
  title: doc.title,
  location: doc.location,
  description: doc.description,
  status: doc.status,
  postType: doc.postType ?? 'lost',
  imageUrl: doc.imageUrl,
  categoryId: doc.categoryId,
  categoryLabel: doc.categoryLabel,
  createdBy: doc.createdBy,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const useFeedStore = create<FeedState>((set, get) => ({
  items: [],
  categories: [{ id: 'all', label: 'All' }],
  selectedCategoryId: 'all',
  isLoading: false,
  isCreating: false,
  error: null,
  hasLoaded: false,

  setItems: (items) =>
    set(() => ({
      items,
      categories: deriveCategories(items),
      selectedCategoryId: 'all',
    })),

  selectCategory: (categoryId) => set(() => ({ selectedCategoryId: categoryId })),

  loadItems: () => {
    set({ isLoading: true, error: null });
    const unsubscribe = subscribeToCollection<FirestoreItemDoc>(
      'items',
      (docs) => {
        const mapped = docs.map(mapDocToFeedItem);
        set({
          items: mapped,
          categories: deriveCategories(mapped),
          isLoading: false,
          hasLoaded: true,
          error: null,
        });
      },
      orderBy('createdAt', 'desc')
    );

    return () => {
      unsubscribe();
    };
  },

  createItem: async (item) => {
    set({ isCreating: true, error: null });
    try {
      const id = await addDocument('items', item);
      set({ isCreating: false });
      return id;
    } catch (error: any) {
      set({ isCreating: false, error: error?.message || 'Failed to create item' });
      throw error;
    }
  },

  getItemById: (itemId) => {
    const { items } = get();
    return items.find((item) => item.item_id === itemId);
  },

  getFilteredItems: () => {
    const { items, selectedCategoryId } = get();
    if (selectedCategoryId === 'all') return items;
    return items.filter((item) => item.categoryId === selectedCategoryId);
  },
}));
