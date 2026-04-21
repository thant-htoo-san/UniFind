import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import UniButton from '../../../core/components/UniButton';
import { useFeedStore } from '../../feed/store/useFeedStore';
import { Category } from '../../feed/types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { storage } from '../../../config/firebase';

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'documents', label: 'Documents' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'others', label: 'Others' },
];

const PostItemScreen: React.FC = () => {
  const { categories, createItem, isCreating } = useFeedStore((state) => ({
    categories: state.categories,
    createItem: state.createItem,
    isCreating: state.isCreating,
  }));
  const user = useAuthStore((state) => state.user);
  const filteredCategories = useMemo(() => categories.filter((c) => c.id !== 'all'), [categories]);
  const postCategories = useMemo(
    () => (filteredCategories.length > 0 ? filteredCategories : FALLBACK_CATEGORIES),
    [filteredCategories]
  );

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (!selectedCategory && postCategories.length > 0) {
      setSelectedCategory(postCategories[0].id);
    }
  }, [postCategories, selectedCategory]);

  const uploadImageAsync = async (uri: string, userId: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const extension = uri.split('.').pop()?.split('?')[0] || 'jpg';
    const imageRef = ref(storage, `items/${userId}/${Date.now()}.${extension}`);
    await uploadBytes(imageRef, blob);
    return getDownloadURL(imageRef);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (asset?.uri) {
      setSelectedImageUri(asset.uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim() || !selectedCategory) {
      Alert.alert('Missing fields', 'Please add title, location, and category.');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Login required', 'Please log in again before posting.');
      return;
    }

    const selected = postCategories.find((c) => c.id === selectedCategory);
    if (!selected) {
      Alert.alert('Category required', 'Please select a valid category.');
      return;
    }

    try {
      setIsUploadingImage(true);
      let imageUrl = '';
      
      // Upload image only if one is selected (optional)
      if (selectedImageUri) {
        imageUrl = await uploadImageAsync(selectedImageUri, user.uid);
      }

      await createItem({
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
        status: 'unclaimed',
        imageUrl,
        categoryId: selected.id,
        categoryLabel: selected.label,
        createdBy: user.uid,
      });

      setTitle('');
      setLocation('');
      setDescription('');
      setSelectedImageUri('');
      setSelectedCategory(postCategories[0]?.id ?? '');
      Alert.alert('Posted', 'Your item is now live in the feed.');
    } catch (error: any) {
      const code = error?.code ? `${error.code}: ` : '';
      const message = error?.message || 'Could not post item.';
      Alert.alert('Post failed', `${code}${message}`);
    } finally {
      setIsUploadingImage(false);
    }
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

          <Field label="Image">
            <Pressable style={styles.imagePickerButton} onPress={handlePickImage}>
              <Text style={styles.imagePickerButtonText}>
                {selectedImageUri ? 'Change Image' : 'Choose Image'}
              </Text>
            </Pressable>
            {selectedImageUri ? <Image source={{ uri: selectedImageUri }} style={styles.previewImage} /> : null}
          </Field>

          <Field label="Category">
            <View style={styles.chipRow}>
              {postCategories.map((category: Category) => {
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

          <UniButton
            label={isUploadingImage ? 'Uploading image...' : isCreating ? 'Posting...' : 'Post Item'}
            onPress={handleSubmit}
            disabled={isCreating || isUploadingImage}
          />
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
  imagePickerButton: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  imagePickerButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
  previewImage: {
    marginTop: 10,
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
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
