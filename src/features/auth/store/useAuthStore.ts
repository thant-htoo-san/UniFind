import { create } from 'zustand';
import { User } from 'firebase/auth';
import {
  signIn,
  signUp,
  logOut,
  subscribeToAuthChanges,
  resetPassword,
} from '../../../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await signIn(email, password);
      // User state will be updated by the auth listener
    } catch (error: any) {
      set({ error: error.message || 'Failed to login' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, password: string, displayName?: string) => {
    set({ isLoading: true, error: null });
    try {
      await signUp(email, password, displayName);
      // User state will be updated by the auth listener
    } catch (error: any) {
      set({ error: error.message || 'Failed to register' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logOut();
      // User state will be updated by the auth listener
    } catch (error: any) {
      set({ error: error.message || 'Failed to logout' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  sendPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await resetPassword(email);
    } catch (error: any) {
      set({ error: error.message || 'Failed to send password reset email' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  initializeAuth: () => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user: User | null) => {
      set({ user, isInitialized: true });
    });
    return unsubscribe;
  },
}));
