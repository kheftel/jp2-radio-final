import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useAudio } from '../context/AudioContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { Streams, Links, AppConfig } from '../constants/config';

/**
 * PlayerScreen — controls the shared radio player.
 *
 * The player instance lives in App.tsx and is provided via AudioContext, so
 * closing this modal does NOT stop playback. This screen only reads state and
 * calls play / pause / switchStream from context, plus owns the sleep timer.
 */
export default function PlayerScreen() {
  const navigation = useNavigation();
  const { isPlaying, currentStream, currentShow, streamError, play, pause, switchStream, volume, setVolume } =
    useAudio();

  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState(0);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount — the player service stays alive globally.
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const togglePlayback = () => {
    isPlaying ? pause() : play();
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Listen to JP2 Radio live! ${Links.website}`, title: 'JP2 Radio' });
    } catch {
      Alert.alert('Share unavailable', 'Could not open share sheet.');
    }
  };

  const setSleepTimerMinutes = (minutes: number) => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (sleepTimer === minutes) {
      setSleepTimer(null);
      setSleepTimeRemaining(0);
      return;
    }

    setSleepTimer(minutes);
    setSleepTimeRemaining(minutes * 60);

    // Countdown display
    countdownRef.current = setInterval(() => {
      setSleepTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Stop playback after timer
    sleepTimerRef.current = setTimeout(() => {
      pause();
      setSleepTimer(null);
      setSleepTimeRemaining(0);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }, minutes * 60 * 1000);
  };

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={28} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.stationToggle}>
          <Text style={styles.stationLabel}>YOUR STATION</Text>
          <View style={styles.stationButtons}>
            {Object.values(Streams).map((stream) => (
              <TouchableOpacity
                key={stream.id}
                style={[styles.stationButton, currentStream.id === stream.id && styles.stationButtonActive]}
                onPress={() => switchStream(stream)}
              >
                <Text
                  style={[
                    styles.stationButtonText,
                    currentStream.id === stream.id && styles.stationButtonTextActive,
                  ]}
                >
                  {stream.frequency} {stream.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.artwork}>
          <View style={styles.artworkInner}>
            <Text style={styles.artworkText}>JP2</Text>
          </View>
        </View>

        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.showName}>{currentShow}</Text>
        <Text style={styles.stationInfo}>
          {currentStream.name} · {currentStream.frequency}
        </Text>

        {streamError && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={16} color={Colors.primary} />
            <Text style={styles.errorText}>{streamError}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.volumeContainer}>
          <Ionicons name="volume-low" size={20} color={Colors.textSecondary} />
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.white}
          />
          <Ionicons name="volume-high" size={20} color={Colors.textSecondary} />
        </View>

        <View style={styles.timerRow}>
          {AppConfig.sleepTimerOptions.map((minutes) => (
            <TouchableOpacity key={minutes} style={styles.timerButton} onPress={() => setSleepTimerMinutes(minutes)}>
              <Ionicons
                name="moon-outline"
                size={20}
                color={sleepTimer === minutes ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.timerText, sleepTimer === minutes && styles.timerTextActive]}>{minutes}m</Text>
            </TouchableOpacity>
          ))}
        </View>

        {sleepTimer !== null && sleepTimeRemaining > 0 && (
          <TouchableOpacity style={styles.countdownContainer} onPress={() => setSleepTimerMinutes(sleepTimer)}>
            <Text style={styles.countdownText}>Sleep in {formatTimeRemaining(sleepTimeRemaining)}</Text>
            <Text style={styles.cancelText}>Tap to cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.xl },
  stationToggle: { width: '100%', marginBottom: Spacing.xxl },
  stationLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  stationButtons: { flexDirection: 'row', gap: Spacing.sm },
  stationButton: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stationButtonActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stationButtonText: { color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: '500' },
  stationButtonTextActive: { color: Colors.white },
  artwork: {
    width: 200,
    height: 200,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  artworkInner: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkText: { color: Colors.white, fontSize: 24, fontWeight: '700' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  liveDot: { width: 8, height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  liveText: { color: Colors.primary, fontSize: FontSizes.xs, fontWeight: '700' },
  showName: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  stationInfo: { color: Colors.textSecondary, fontSize: FontSizes.md, marginBottom: Spacing.xxl },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(199, 32, 39, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  errorText: { color: Colors.primary, fontSize: FontSizes.sm },
  playButton: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  volumeSlider: { flex: 1 },
  timerRow: { flexDirection: 'row', gap: Spacing.lg },
  timerButton: { alignItems: 'center', gap: 4 },
  timerText: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  timerTextActive: { color: Colors.primary },
  countdownContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countdownText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '600' },
  cancelText: { color: Colors.textSecondary, fontSize: FontSizes.xs, marginTop: 4 },
});
