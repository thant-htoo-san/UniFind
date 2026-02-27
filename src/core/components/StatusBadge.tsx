import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ItemStatus = 'unclaimed' | 'returned';

interface StatusBadgeProps {
  status: ItemStatus;
}

const STATUS_STYLES: Record<ItemStatus, { backgroundColor: string; textColor: string }> = {
  unclaimed: { backgroundColor: '#F7D046', textColor: '#0D0D0D' },
  returned: { backgroundColor: '#2ECC71', textColor: '#FFFFFF' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { backgroundColor, textColor } = STATUS_STYLES[status];
  const label = status === 'unclaimed' ? 'Unclaimed' : 'Returned';

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusBadge;
