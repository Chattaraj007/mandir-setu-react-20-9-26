import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

export default function GaneshSplash({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const flameAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      })
    ]).start();

    // Infinite flame flicker loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, {
          toValue: 1.25,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 0.85,
          duration: 450,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Auto-proceed after 3.2 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.omSymbol}>🕉️</Text>
        <Text style={styles.ganeshMantra}>ॐ गं गणपतये नमः</Text>
        <Text style={styles.bengaliGreeting}>শ্রী শ্রী সিদ্ধিদাতা গণেশায় নমঃ</Text>

        <View style={styles.divider} />

        {/* Title bar with Left and Right Sacred Lamps */}
        <View style={styles.titleRow}>
          {/* Left Lamp: Normal orientation */}
          <View style={styles.lampWrapper}>
            <Animated.View style={[styles.flameGlow, { transform: [{ scale: flameAnim }] }]} />
            <Text style={styles.lampEmoji}>🪔</Text>
          </View>

          <View style={styles.titleTextContainer}>
            <Text style={styles.appTitleEn}>Mandir Setu App</Text>
            <Text style={styles.appTitleBn}>মন্দির সেতু • সর্ব ভারতীয় তীর্থ সেবা</Text>
          </View>

          {/* Right Lamp: Horizontally mirrored so flame of fire is reflected in opposite side! */}
          <View style={[styles.lampWrapper, styles.mirroredLamp]}>
            <Animated.View style={[styles.flameGlow, { transform: [{ scale: flameAnim }] }]} />
            <Text style={styles.lampEmoji}>🪔</Text>
          </View>
        </View>

        <Text style={styles.subtext}>ডিজিটাল মন্দিরে প্রবেশ করুন...</Text>

        <TouchableOpacity style={styles.enterButton} onPress={onFinish} activeOpacity={0.8}>
          <Text style={styles.enterButtonText}>প্রবেশ করুন • Enter Darshan</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mandirRedDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    maxWidth: 420,
    width: '100%',
  },
  omSymbol: {
    fontSize: 54,
    marginBottom: 8,
  },
  ganeshMantra: {
    color: Colors.mandirGoldLight,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  bengaliGreeting: {
    color: '#FFE082',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '85%',
    backgroundColor: Colors.borderGold,
    marginVertical: 14,
    opacity: 0.6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  lampWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mirroredLamp: {
    // Horizontally mirrored: Flame points symmetrically in the opposite direction
    transform: [{ scaleX: -1 }],
  },
  flameGlow: {
    position: 'absolute',
    top: 2,
    left: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 213, 79, 0.45)',
  },
  lampEmoji: {
    fontSize: 24,
  },
  titleTextContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  appTitleEn: {
    color: Colors.pureWhite,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appTitleBn: {
    color: Colors.mandirGoldLight,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  subtext: {
    color: '#FFCC80',
    fontSize: 13,
    marginTop: 18,
    fontStyle: 'italic',
  },
  enterButton: {
    marginTop: 22,
    backgroundColor: Colors.mandirGold,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  enterButtonText: {
    color: Colors.mandirRedDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
