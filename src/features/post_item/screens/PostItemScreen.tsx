import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostItemScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Post Item</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default PostItemScreen;
