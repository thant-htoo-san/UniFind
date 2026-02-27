import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Add a document to a collection
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Get a single document by ID
export const getDocument = async <T>(collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
  }
  return null;
};

// Get all documents from a collection
export const getDocuments = async <T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
) => {
  const q = query(collection(db, collectionName), ...queryConstraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (T & { id: string })[];
};

// Update a document
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// Subscribe to real-time updates for a collection
export const subscribeToCollection = <T>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  ...queryConstraints: QueryConstraint[]
) => {
  const q = query(collection(db, collectionName), ...queryConstraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
    callback(data);
  });
};

// Subscribe to real-time updates for a single document
export const subscribeToDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (data: (T & { id: string }) | null) => void
) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T & { id: string });
    } else {
      callback(null);
    }
  });
};

// Re-export query helpers for convenience
export { where, orderBy, limit };
