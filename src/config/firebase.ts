import { initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_DATABASE_URL,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  databaseURL: FIREBASE_DATABASE_URL,
};

// Debug: Log config to verify env vars are loaded
console.log('Firebase Config:', {
  apiKey: FIREBASE_API_KEY ? 'loaded' : 'missing',
  authDomain: FIREBASE_AUTH_DOMAIN ? 'loaded' : 'missing',
  projectId: FIREBASE_PROJECT_ID ? 'loaded' : 'missing',
});

const app = initializeApp(firebaseConfig);

const authInstance =
  Platform.OS === 'web'
    ? FirebaseAuth.getAuth(app)
    : (() => {
        try {
          const getReactNativePersistence = (FirebaseAuth as any).getReactNativePersistence;
          if (typeof getReactNativePersistence === 'function') {
            return FirebaseAuth.initializeAuth(app, {
              persistence: getReactNativePersistence(AsyncStorage),
            });
          }

          return FirebaseAuth.getAuth(app);
        } catch {
          return FirebaseAuth.getAuth(app);
        }
      })();

export const auth = authInstance;
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
// 🔥 Firestore Test Functions

import { collection, addDoc, getDocs } from 'firebase/firestore';

// Test WRITE
export const testWriteFirestore = async () => {
  try {
    const docRef = await addDoc(collection(db, 'test'), {
      name: 'Thant Htoo San',
      status: 'Firestore connected ✅',
      createdAt: new Date(),
    });

    console.log('✅ Document written with ID:', docRef.id);
  } catch (error) {
    console.error('❌ Error writing document:', error);
  }
};

// Test READ
export const testReadFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'test'));

    console.log('📦 Reading documents...');
    querySnapshot.forEach((doc) => {
      console.log(`📄 ${doc.id} =>`, doc.data());
    });
  } catch (error) {
    console.error('❌ Error reading documents:', error);
  }
};