import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { Streams } from '../constants/config';

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const [activeStation, setActiveStation] = useState<'imperial-valley' | 'san-diego'>('imperial-valley');

  const scheduleUrl = activeStation === 'imperial-valley' ? Streams.imperialValley.scheduleUrl : Streams.sanDiego.scheduleUrl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.white} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Program Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeStation === 'imperial-valley' && styles.toggleButtonActive]}
          onPress={() => setActiveStation('imperial-valley')}
        >
          <Text style={[styles.toggleText, activeStation === 'imperial-valley' && styles.toggleTextActive]}>Imperial Valley</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeStation === 'san-diego' && styles.toggleButtonActive]}
          onPress={() => setActiveStation('san-diego')}
        >
          <Text style={[styles.toggleText, activeStation === 'san-diego' && styles.toggleTextActive]}>San Diego</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: scheduleUrl }}
          style={styles.webview}
          scalesPageToFit={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg },
  headerTitle: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '600' },
  toggleContainer: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  toggleButton: { flex: 1, padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  toggleButtonActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  toggleText: { color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: '500' },
  toggleTextActive: { color: Colors.white },
  webviewContainer: { flex: 1, margin: Spacing.lg, borderRadius: BorderRadius.md, overflow: 'hidden' },
  webview: { flex: 1, backgroundColor: Colors.background },
});
