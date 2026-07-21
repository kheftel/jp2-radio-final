import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { Links, AppConfig } from '../constants/config';

const menuItems = [
  { id: 'home', label: 'Home', icon: 'home-outline', screen: 'Main' },
  { id: 'schedule', label: 'Schedule', icon: 'time-outline', screen: 'Schedule' },
  { id: 'podcasts', label: 'Podcasts', icon: 'headset-outline', url: Links.podcasts },
  { id: 'blog', label: 'Blog', icon: 'newspaper-outline', url: Links.blog },
  { id: 'events', label: 'Events', icon: 'calendar-outline', url: Links.events },
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube', url: Links.youtube },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
];

export default function MenuScreen() {
  const navigation = useNavigation<any>();

  const handlePress = (item: typeof menuItems[0]) => {
    if (item.url) {
      Linking.openURL(item.url);
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.inner} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={28} color={Colors.white} /></TouchableOpacity>
        </View>

        <View style={styles.logoRow}>
          <View style={styles.logoBox}><Text style={styles.logoText}>JP2</Text></View>
          <Text style={styles.logoTitle}>JP2 Radio</Text>
        </View>

        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handlePress(item)}>
              <Ionicons name={item.icon as any} size={22} color="rgba(255,255,255,0.8)" />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => Linking.openURL(Links.privacy)}><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(Links.terms)}><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
          </View>
          <Text style={styles.version}>Version {AppConfig.version}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  inner: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: Spacing.xl, paddingTop: Spacing.lg },
  date: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xl, marginBottom: Spacing.xxl },
  logoBox: { width: 40, height: 40, backgroundColor: Colors.white, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  logoTitle: { color: Colors.white, fontSize: FontSizes.xl, fontWeight: '700' },
  menuList: { paddingHorizontal: Spacing.xl },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, paddingVertical: Spacing.lg, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)' },
  menuLabel: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '500' },
  footer: { position: 'absolute', bottom: Spacing.xxxl, left: Spacing.xl, right: Spacing.xl },
  footerLinks: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.sm },
  footerLink: { color: 'rgba(255,255,255,0.6)', fontSize: FontSizes.sm },
  version: { color: 'rgba(255,255,255,0.4)', fontSize: FontSizes.xs },
});
