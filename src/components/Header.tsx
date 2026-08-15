import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors, FontSizes, Spacing } from "../constants/theme";

/**
 * Shared app header: hamburger menu | JP2 logo + title | settings gear
 *
 * Used across Home, Mic, Connect, and any future top-level screens.
 * Edit the logo or layout here once and it updates everywhere.
 */
export default function Header() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Menu")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="menu" size={24} color={Colors.white} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Image source={require("./header-logo.png")} />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="settings-outline" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBox: {
    width: 28,
    height: 28,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "700",
  },
  headerTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
});
