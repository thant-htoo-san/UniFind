import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UniButton from '../../../core/components/UniButton';
import { RouteNames } from '../../../navigation/routeNames';
import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, typeof RouteNames.LOGIN>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (isSignUp) {
        await register(email, password, displayName || undefined);
      } else {
        await login(email, password);
      }
      navigation.replace(RouteNames.MAIN_TABS);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to UniFind</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Campus-only lost & found'}
          </Text>

          <View style={styles.form}>
            {isSignUp && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Display Name</Text>
                <TextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Your name"
                  autoCapitalize="words"
                  style={styles.input}
                  editable={!isLoading}
                />
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@university.edu"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                editable={!isLoading}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                style={styles.input}
                editable={!isLoading}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <UniButton
              label={isLoading ? '' : isSignUp ? 'Create Account' : 'Enter UniFind'}
              onPress={handleSubmit}
              disabled={isLoading}
            />
            {isLoading && (
              <ActivityIndicator
                style={styles.loader}
                color="#6366F1"
              />
            )}

            <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
              <Text style={styles.toggleText}>
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;
