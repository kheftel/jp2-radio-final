import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { Links } from '../constants/config';

export default function DonateScreen() {
  useEffect(() => {
    Linking.openURL(Links.donate);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Ionicons name="heart" size={64} color={Colors.primary} />
        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.subtitle}>Opening donation page...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  title: { color: Colors.white, fontSize: FontSizes.title, fontWeight: '700' },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.md },
});
