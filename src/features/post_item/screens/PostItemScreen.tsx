import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UniButton from '../../../core/components/UniButton';
import { useFeedStore } from '../../feed/store/useFeedStore';
import { Category } from '../../feed/types';

const PostItemScreen: React.FC = () => {
  const { categories } = useFeedStore((state) => ({ categories: state.categories }));
  const filteredCategories = useMemo(() => categories.filter((c) => c.id !== 'all'), [categories]);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(filteredCategories[0]?.id ?? '');

  const handleSubmit = () => {
    Alert.alert('Saved', 'Your item has been saved as a draft for now.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Post a Lost Item</Text>
        <Text style={styles.subtitle}>Share details so others can find it quickly.</Text>

        <View style={styles.form}>
          <Field label="Title">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Black iPhone 13"
              style={styles.input}
            />
          </Field>

          <Field label="Location">
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Where you found it"
              style={styles.input}
            />
          </Field>

          <Field label="Category">
            <View style={styles.chipRow}>
              {filteredCategories.map((category: Category) => {
                const isActive = category.id === selectedCategory;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
                  >
                    <Text style={[styles.chipLabel, isActive ? styles.chipLabelActive : styles.chipLabelInactive]}>
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Description">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add details, stickers, identifiable marks"
              style={[styles.input, styles.multiline]}
              multiline
              numberOfLines={4}
            />
          </Field>

          <UniButton label="Save" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  form: {
    marginBottom: 8,
  },
  fieldGroup: {
    marginBottom: 16,
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
  multiline: {
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#007AFF',
  },
  chipInactive: {
    backgroundColor: '#F2F2F2',
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
  chipLabelInactive: {
    color: '#0F172A',
  },
});

export default PostItemScreen;
