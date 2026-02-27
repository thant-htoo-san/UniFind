import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';

type Conversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
};

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Alex (Library Desk)', preview: 'Sure, I can meet at 3pm.', time: '2m ago' },
  { id: '2', name: 'Jamie (Gym)', preview: 'Thanks! That sounds like mine.', time: '1h ago' },
  { id: '3', name: 'Priya (Science Hall)', preview: 'Can you describe the cover?', time: 'Yesterday' },
];

const MessagesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <MessageCircle size={20} color="#0F172A" strokeWidth={2.25} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.preview}>{item.preview}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#6B7280',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  separator: {
    height: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default MessagesScreen;
