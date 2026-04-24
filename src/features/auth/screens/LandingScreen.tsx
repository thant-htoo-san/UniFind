import React, { useEffect, useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { RouteNames } from '../../../navigation/routeNames';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, typeof RouteNames.LANDING>;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 760;
  const heroAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 520,
      useNativeDriver: true,
    }).start();
  }, [heroAnim]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.content}>
          <View style={styles.glowTop} />
          <View style={styles.glowBottom} />
          <View style={styles.navBar}>
            <View style={styles.brandWrap}>
              <View style={styles.logoBox}>
                <View style={styles.logoDiamond} />
              </View>
              <Text style={styles.brand}>UniFind</Text>
            </View>
            <View style={styles.navTag}>
              <View style={styles.navDot} />
              <Text style={styles.navTagText}>Campus lost + found</Text>
            </View>
          </View>

          <View style={[styles.hero, isMobile && styles.heroMobile]}>
            <Animated.View
              style={[
                styles.leftCol,
                {
                  opacity: heroAnim,
                  transform: [
                    {
                      translateY: heroAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [18, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.kicker}>
                <Text style={styles.kickerText}>Find. Report. Reunite.</Text>
              </View>
              <Text style={[styles.title, isMobile && styles.titleMobile]}>Lost and found</Text>
              <Text style={[styles.title, styles.titleBlue, isMobile && styles.titleMobile]}>made simple</Text>
              <Text style={[styles.title, isMobile && styles.titleMobile]}>for campus life.</Text>
              <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
                Post a lost item in seconds, browse nearby finds, and message safely inside UniFind.
              </Text>

              <View style={styles.ctaRow}>
                <Pressable
                  onPress={() => navigation.navigate(RouteNames.LOGIN)}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </Pressable>
                
              </View>

            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF1F7',
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
    marginBottom: 20,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navTag: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#CBD5F5',
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#1D4ED8',
  },
  navTagText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  heroMobile: {
    flexDirection: 'column',
  },
  leftCol: {
    flex: 1,
    paddingTop: 38,
    paddingBottom: 18,
  },
  kicker: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  kickerText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0F172A',
    fontSize: 88,
    fontWeight: '800',
    lineHeight: 94,
    letterSpacing: -1.2,
  },
  titleMobile: {
    fontSize: 48,
    lineHeight: 54,
    letterSpacing: -0.6,
  },
  titleBlue: {
    color: '#1D4ED8',
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
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 26,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 26,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#CBD5F5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(59, 130, 246, 0.16)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(14, 116, 144, 0.18)',
  },
});

export default LandingScreen;
