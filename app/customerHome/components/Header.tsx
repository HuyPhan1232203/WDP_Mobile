// components/home/Header.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  onSettingsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSettingsPress }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name="flash-sharp"
          size={24}
          color="#333"
          style={styles.icon}
        />
        <Text style={styles.headerTitle}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onSettingsPress || (() => router.push("/setting/setting"))}
      >
        <Ionicons name="settings-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  settingsButton: {
    padding: 5,
  },
});
