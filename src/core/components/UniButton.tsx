import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

interface UniButtonProps extends PressableProps {
  label: string;
}

const UniButton: React.FC<UniButtonProps> = ({ label, style, disabled, ...pressableProps }) => {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...pressableProps}
    >
      <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
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
  disabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledLabel: {
    color: '#F3F4F6',
  },
});

export default UniButton;
