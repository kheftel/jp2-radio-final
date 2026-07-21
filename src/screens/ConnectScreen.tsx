import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { Links, Contact } from '../constants/config';

const contactItems = [
  { id: 'call', label: 'Call Us', icon: 'call', color: '#3B82F6', action: () => Linking.openURL(`tel:${Contact.phone}`) },
  { id: 'email', label: 'Email Us', icon: 'mail', color: '#22C55E', action: () => Linking.openURL(`mailto:${Contact.email}`) },
  { id: 'text', label: 'Text Us', icon: 'chatbubble', color: '#333', action: () => Linking.openURL(`sms:${Contact.phone}`) },
];

const socialItems = [
  { id: 'facebook', label: 'Facebook', icon: 'logo-facebook', color: '#1877F2', url: Links.facebook },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E4405F', url: Links.instagram },
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube', color: '#FF0000', url: Links.youtube },
];

export default function ConnectScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Connect</Text>
        <Text style={styles.subtitle}>Get in touch with us</Text>

        <Text style={styles.sectionLabel}>CONTACT US</Text>
        <View style={styles.grid}>
          {contactItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.gridItem, { backgroundColor: item.color }]} onPress={item.action}>
              <Ionicons name={item.icon as any} size={28} color={Colors.white} />
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>FOLLOW US</Text>
        <View style={styles.grid}>
          {socialItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.gridItem, { backgroundColor: item.color }]} onPress={() => Linking.openURL(item.url)}>
              <Ionicons name={item.icon as any} size={28} color={Colors.white} />
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl },
  title: { color: Colors.white, fontSize: FontSizes.title, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.md, textAlign: 'center', marginBottom: Spacing.xxl },
  sectionLabel: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: Spacing.md },
  grid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  gridItem: { flex: 1, aspectRatio: 1, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', gap: 8 },
  gridLabel: { color: Colors.white, fontSize: FontSizes.xs, fontWeight: '500' },
});
