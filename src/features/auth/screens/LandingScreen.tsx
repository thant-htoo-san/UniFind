import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { RouteNames } from '../../../navigation/routeNames';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, typeof RouteNames.LANDING>;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 760;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.content}>
          <View style={styles.navBar}>
            <View style={styles.brandWrap}>
              <View style={styles.logoBox}>
                <View style={styles.logoDiamond} />
              </View>
              <Text style={styles.brand}>UniFind</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.leftCol}>
              <Text style={[styles.title, isMobile && styles.titleMobile]}>Lost and found</Text>
              <Text style={[styles.title, styles.titleBlue, isMobile && styles.titleMobile]}>made simple</Text>
              <Text style={[styles.title, isMobile && styles.titleMobile]}>for campus life.</Text>
              

              <Pressable
                onPress={() => navigation.navigate(RouteNames.LOGIN)}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF6',
  },
  page: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  navBar: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 16,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDiamond: {
    width: 14,
    height: 14,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  brand: {
    color: '#0F172A',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 46,
  },
  hero: {
    alignItems: 'flex-start',
  },
  leftCol: {
    width: '100%',
    paddingTop: 38,
    paddingBottom: 18,
  },
  title: {
    color: '#0F172A',
    fontSize: 88,
    fontWeight: '800',
    lineHeight: 94,
  },
  titleMobile: {
    fontSize: 48,
    lineHeight: 54,
  },
  titleBlue: {
    color: '#2563EB',
  },
  subtitle: {
    marginTop: 18,
    color: '#334155',
    fontSize: 22,
    lineHeight: 38,
    maxWidth: 690,
  },
  subtitleMobile: {
    fontSize: 18,
    lineHeight: 30,
  },
  primaryButton: {
    marginTop: 26,
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 26,
    backgroundColor: 'rgb(37, 99, 235)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default LandingScreen;
