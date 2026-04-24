import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../config/supabase';

import UniButton from '../../../core/components/UniButton';
import { useFeedStore } from '../../feed/store/useFeedStore';
import { Category, PostType } from '../../feed/types';
import { AuthState, useAuthStore } from '../../auth/store/useAuthStore';

const SUPABASE_BUCKET = 'items';

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'bags', label: 'Bags' },
  { id: 'wallets-ids', label: 'Wallets & IDs - sports, cards' },
  { id: 'clothing-accessories', label: 'Clothing & Accessories' },
  { id: 'keys', label: 'Keys' },
  { id: 'documents', label: 'Documents' },
  { id: 'water-bottles-containers', label: 'Water Bottles & Containers' },
  { id: 'books-study-items', label: 'Books & Study Items' },
  { id: 'other', label: 'Other' },
];

const PostItemScreen: React.FC = () => {
  const { categories, createItem, isCreating } = useFeedStore((state) => ({
    categories: state.categories,
    createItem: state.createItem,
    isCreating: state.isCreating,
  }));
  const user = useAuthStore((state: AuthState) => state.user);
  const filteredCategories = useMemo(() => categories.filter((c) => c.id !== 'all'), [categories]);
  const postCategories = useMemo(() => {
    const merged = new Map<string, string>();
    FALLBACK_CATEGORIES.forEach((category) => merged.set(category.id, category.label));
    filteredCategories.forEach((category) => merged.set(category.id, category.label));

    return Array.from(merged.entries()).map(([id, label]) => ({ id, label }));
  }, [filteredCategories]);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [postType, setPostType] = useState<PostType>('lost');

  useEffect(() => {
    if (!selectedCategory && postCategories.length > 0) {
      setSelectedCategory(postCategories[0].id);
    }
  }, [postCategories, selectedCategory]);

  const uploadImageAsync = async (asset: ImagePicker.ImagePickerAsset, userId: string) => {
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const fileName = asset.fileName || '';
    const nameExtension = fileName.includes('.') ? fileName.split('.').pop() : '';
    const mimeExtension = asset.mimeType?.includes('/') ? asset.mimeType.split('/').pop() : '';
    const extension = (nameExtension || mimeExtension || 'jpg').toLowerCase();
    const filePath = `${userId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, blob, {
        contentType: asset.mimeType || blob.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Upload failed');
    }

    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);
    if (!data?.publicUrl) {
      throw new Error('Failed to get image URL');
    }

    return data.publicUrl;
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
      setSelectedImage(asset);
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
      if (selectedImage) {
        imageUrl = await uploadImageAsync(selectedImage, user.uid);
      }

      await createItem({
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
        status: 'unclaimed',
        postType,
        imageUrl,
        categoryId: selected.id,
        categoryLabel: selected.label,
        createdBy: user.uid,
      });

      setTitle('');
      setLocation('');
      setDescription('');
      setSelectedImage(null);
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
        <Text style={styles.title}>{postType === 'lost' ? 'Post a Lost Item' : 'Post a Found Item'}</Text>
        <Text style={styles.subtitle}>
          {postType === 'lost'
            ? 'Share details so others can help you find it quickly.'
            : 'Share details so the owner can recognize and claim it.'}
        </Text>

        <View style={styles.form}>
          <Field label="Type">
            <View style={styles.toggleRow}>
              {(['lost', 'found'] as PostType[]).map((type) => {
                const isActive = postType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setPostType(type)}
                    style={[styles.toggleChip, isActive ? styles.toggleChipActive : styles.toggleChipInactive]}
                  >
                    <Text style={[styles.toggleText, isActive ? styles.toggleTextActive : styles.toggleTextInactive]}>
                      {type === 'lost' ? 'Lost' : 'Found'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>
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
              placeholder={postType === 'lost' ? 'Where you lost it' : 'Where you found it'}
              style={styles.input}
            />
          </Field>

          <Field label="Image">
            <Pressable style={styles.imagePickerButton} onPress={handlePickImage}>
              <Text style={styles.imagePickerButtonText}>
                {selectedImage ? 'Change Image' : 'Choose Image'}
              </Text>
            </Pressable>
            {selectedImage?.uri ? <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} /> : null}
          </Field>

          <Field label="Category">
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => setSelectedCategory(String(value))}
                style={styles.picker}
                dropdownIconColor="#0F172A"
              >
                {postCategories.map((category: Category) => (
                  <Picker.Item key={category.id} label={category.label} value={category.id} />
                ))}
              </Picker>
            </View>
          </Field>

          <Field label="Description">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={postType === 'lost'
                ? 'Add details, stickers, identifiable marks'
                : 'Describe condition, marks, or accessories'}
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  picker: {
    minHeight: 44,
    color: '#0F172A',
  },
  toggleRow: {
    flexDirection: 'row',
  },
  toggleChip: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    marginRight: 10,
  },
  toggleChipActive: {
    backgroundColor: '#0F172A',
  },
  toggleChipInactive: {
    backgroundColor: '#E5E7EB',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleTextInactive: {
    color: '#111827',
  },
});

export default PostItemScreen;
