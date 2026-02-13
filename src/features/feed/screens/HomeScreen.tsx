import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';

type ItemType = 'found' | 'lost';

type ItemCard = {
  id: string;
  title: string;
  category: string;
  location: string;
  timeAgo: string;
  type: ItemType;
};

const PRIMARY = '#1E6DFF';
const BG = '#F5F7FB';
const TEXT_MUTED = '#4B5563';

const CATEGORIES = ['Cards', 'Laptops', 'Bottles', 'Keys', 'Backpacks'];

const MOCK_ITEMS: ItemCard[] = [
  {
    id: '1',
    title: 'Black backpack with laptop sleeve',
    category: 'Backpacks',
    location: 'Library Level 3',
    timeAgo: '5m ago',
    type: 'found',
  },
  {
    id: '2',
    title: 'Student ID - Sarah L.',
    category: 'Cards',
    location: 'Engineering Atrium',
    timeAgo: '20m ago',
    type: 'found',
  },
  {
    id: '3',
    title: 'Blue Hydroflask 32oz',
    category: 'Bottles',
    location: 'Gym Front Desk',
    timeAgo: '45m ago',
    type: 'found',
  },
  {
    id: '4',
    title: 'Silver MacBook Air',
    category: 'Laptops',
    location: 'CS Lab 210',
    timeAgo: '1h ago',
    type: 'lost',
  },
  {
    id: '5',
    title: 'Keychain with panda charm',
    category: 'Keys',
    location: 'Cafeteria',
    timeAgo: '2h ago',
    type: 'lost',
  },
];

const HomeScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<ItemType>('found');
  const [mapView, setMapView] = useState(false);

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const matchesType = item.type === currentType;
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesQuery = query.trim()
        ? item.title.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.location.toLowerCase().includes(query.trim().toLowerCase())
        : true;
      return matchesType && matchesCategory && matchesQuery;
    });
  }, [currentType, query, selectedCategory]);

  const renderItem = ({ item }: { item: ItemCard }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTime}>{item.timeAgo}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardLocation}>{item.location}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Home</Text>
          <Pressable onPress={() => setMapView(!mapView)} style={styles.mapToggle}>
            <Text style={styles.mapToggleText}>{mapView ? 'Show List' : 'Show Map'}</Text>
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search items or locations"
            placeholderTextColor={TEXT_MUTED}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.toggleRow}>
          {(['found', 'lost'] as ItemType[]).map((type) => {
            const active = currentType === type;
            return (
              <Pressable
                key={type}
                onPress={() => setCurrentType(type)}
                style={[styles.segment, active && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {type === 'found' ? 'Found items' : 'Lost items'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.chipsRow}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(active ? null : cat)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>

        {mapView ? (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map preview (pins for items)</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  mapToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E5EDFF',
  },
  mapToggleText: {
    color: PRIMARY,
    fontWeight: '600',
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 16,
    color: '#111827',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  segmentText: {
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#E5EDFF',
    borderColor: PRIMARY,
  },
  chipText: {
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  chipTextActive: {
    color: PRIMARY,
  },
  mapPlaceholder: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardCategory: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 13,
  },
  cardTime: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardLocation: {
    color: TEXT_MUTED,
    fontSize: 14,
  },
  separator: {
    height: 12,
  },
});

export default HomeScreen;
