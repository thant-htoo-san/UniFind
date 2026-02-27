export type ItemStatus = 'unclaimed' | 'returned';

export type FeedItem = {
  item_id: string;
  title: string;
  location: string;
  status: ItemStatus;
  imageUrl: string;
  categoryId: string;
  categoryLabel: string;
};

export type Category = {
  id: string;
  label: string;
};
