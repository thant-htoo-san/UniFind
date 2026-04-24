export type ItemStatus = 'unclaimed' | 'claimed' | 'returned';
export type PostType = 'lost' | 'found';

export type FeedItem = {
  item_id: string;
  title: string;
  location: string;
  description?: string;
  status: ItemStatus;
  postType: PostType;
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
