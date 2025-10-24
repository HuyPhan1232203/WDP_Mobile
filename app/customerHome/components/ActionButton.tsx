// components/home/ActionButtons.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onAddVehicle: () => void;
  onBookService: () => void;
  onReportIssue?: () => void;
  onSettings?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddVehicle,
  onBookService,
  onReportIssue,
  onSettings,
}) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.primaryButton} onPress={onAddVehicle}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.primaryButtonText}>Thêm xe mới</Text>
      </TouchableOpacity>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onBookService}
        >
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.secondaryButtonText}>Đặt lịch bảo dưỡng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/issue-report/list")} // Thêm navigation
        >
          <Ionicons name="notifications-outline" size={20} color="#666" />
          <Text style={styles.secondaryButtonText}>Báo cáo vấn đề</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onSettings}>
          <Ionicons name="settings-outline" size={20} color="#666" />
          <Text style={styles.secondaryButtonText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});
