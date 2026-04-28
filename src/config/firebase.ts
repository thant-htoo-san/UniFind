import { initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
//import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type ExpoExtra = {
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppId?: string;
  firebaseDatabaseUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {}) as ExpoExtra;

const firebaseConfig = {
  apiKey: extra.firebaseApiKey ?? '',
  authDomain: extra.firebaseAuthDomain ?? '',
  projectId: extra.firebaseProjectId ?? '',
  storageBucket: extra.firebaseStorageBucket ?? '',
  messagingSenderId: extra.firebaseMessagingSenderId ?? '',
  appId: extra.firebaseAppId ?? '',
  databaseURL: extra.firebaseDatabaseUrl ?? '',
};

const missingFirebaseKeys = [
  ['firebaseApiKey', firebaseConfig.apiKey],
  ['firebaseAuthDomain', firebaseConfig.authDomain],
  ['firebaseProjectId', firebaseConfig.projectId],
  ['firebaseAppId', firebaseConfig.appId],
].filter(([, value]) => !value);

if (missingFirebaseKeys.length > 0) {
  const missingList = missingFirebaseKeys.map(([key]) => key).join(', ');
  console.error(`Missing Firebase config values: ${missingList}`);
}

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
//export const storage = getStorage(app);

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