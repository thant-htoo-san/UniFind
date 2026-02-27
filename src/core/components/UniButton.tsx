import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

interface UniButtonProps extends PressableProps {
  label: string;
}

const UniButton: React.FC<UniButtonProps> = ({ label, style, ...pressableProps }) => {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      {...pressableProps}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default UniButton;
