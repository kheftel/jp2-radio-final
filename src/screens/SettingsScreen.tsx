import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { Links, AppConfig, Streams } from '../constants/config';
import { useAudio } from '../context/AudioContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { currentStream, switchStream } = useAudio();
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.white} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>DEFAULT STATION</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={() => switchStream(Streams.imperialValley)}>
            <Text style={styles.rowLabel}>95.7 FM Imperial Valley</Text>
            {currentStream.id === 'imperial-valley' && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => switchStream(Streams.sanDiego)}>
            <Text style={styles.rowLabel}>93.7 FM San Diego</Text>
            {currentStream.id === 'san-diego' && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(Links.website)}>
            <Text style={styles.rowLabel}>Website</Text>
            <Ionicons name="open-outline" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(Links.privacy)}>
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(Links.terms)}>
            <Text style={styles.rowLabel}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>{AppConfig.version}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg },
  headerTitle: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: Spacing.lg },
  sectionLabel: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600', letterSpacing: 0.5, marginTop: Spacing.xl, marginBottom: Spacing.sm, marginLeft: Spacing.sm },
  section: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { color: Colors.white, fontSize: FontSizes.md },
  rowValue: { color: Colors.textSecondary, fontSize: FontSizes.md },
});
