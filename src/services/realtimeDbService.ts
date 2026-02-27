import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  query,
  orderByChild,
  limitToFirst,
  limitToLast,
  equalTo,
  DataSnapshot,
} from 'firebase/database';
import { rtdb } from '../config/firebase';

// Set data at a specific path (overwrites existing data)
export const setData = async <T>(path: string, data: T) => {
  const dataRef = ref(rtdb, path);
  await set(dataRef, {
    ...data,
    updatedAt: Date.now(),
  });
};

// Push new data to a list (generates unique key)
export const pushData = async <T>(path: string, data: T) => {
  const listRef = ref(rtdb, path);
  const newRef = push(listRef);
  await set(newRef, {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return newRef.key;
};

// Get data at a specific path
export const getData = async <T>(path: string): Promise<T | null> => {
  const dataRef = ref(rtdb, path);
  const snapshot = await get(dataRef);
  if (snapshot.exists()) {
    return snapshot.val() as T;
  }
  return null;
};

// Update specific fields at a path (doesn't overwrite other fields)
export const updateData = async <T extends object>(path: string, data: Partial<T>) => {
  const dataRef = ref(rtdb, path);
  await update(dataRef, {
    ...data,
    updatedAt: Date.now(),
  });
};

// Delete data at a path
export const removeData = async (path: string) => {
  const dataRef = ref(rtdb, path);
  await remove(dataRef);
};

// Subscribe to real-time updates at a path
export const subscribeToData = <T>(
  path: string,
  callback: (data: T | null) => void
) => {
  const dataRef = ref(rtdb, path);
  return onValue(dataRef, (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as T);
    } else {
      callback(null);
    }
  });
};

// Subscribe to a list with query
export const subscribeToQueryData = <T>(
  path: string,
  callback: (data: Record<string, T> | null) => void,
  options?: {
    orderBy?: string;
    limitFirst?: number;
    limitLast?: number;
    equalToValue?: string | number | boolean;
  }
) => {
  let dataRef = ref(rtdb, path);
  let queryRef: any = dataRef;

  if (options?.orderBy) {
    queryRef = query(dataRef, orderByChild(options.orderBy));
    
    if (options.equalToValue !== undefined) {
      queryRef = query(dataRef, orderByChild(options.orderBy), equalTo(options.equalToValue));
    }
  }

  if (options?.limitFirst) {
    queryRef = query(queryRef, limitToFirst(options.limitFirst));
  } else if (options?.limitLast) {
    queryRef = query(queryRef, limitToLast(options.limitLast));
  }

  return onValue(queryRef, (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as Record<string, T>);
    } else {
      callback(null);
    }
  });
};

// Re-export query helpers
export { orderByChild, limitToFirst, limitToLast, equalTo };
