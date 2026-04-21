export type ItemStatus = 'unclaimed' | 'returned';

export type FeedItem = {
  item_id: string;
  title: string;
  location: string;
  description?: string;
  status: ItemStatus;
  imageUrl: string;
  categoryId: string;
  categoryLabel: string;
  createdBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type Category = {
  id: string;
  label: string;
};
