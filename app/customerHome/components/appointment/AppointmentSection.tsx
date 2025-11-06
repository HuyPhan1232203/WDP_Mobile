// components/home/AppointmentsSection.tsx
import { Appointment } from "@/redux/feature/appointmentSlice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentsSectionProps {
  appointments: Appointment[];
  loading: boolean;
  onAppointmentPress: (appointmentId: string) => void;
  onAddAppointment: () => void;
  onViewAll: () => void;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  appointments,
  loading,
  onAppointmentPress,
  onAddAppointment,
  onViewAll,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="calendar-outline" size={20} color="#333" />
          <Text style={styles.sectionTitle}>Lịch bảo dưỡng gần đây</Text>
        </View>
        {appointments && appointments.length > 0 && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Xem thêm</Text>
            <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.sectionSubtitle}>
        Theo dõi trạng thái các lịch hẹn
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : appointments && appointments.length > 0 ? (
        <View style={styles.appointmentList}>
          {appointments.slice(0, 3).map((appointment: Appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onPress={() => onAppointmentPress(appointment._id)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>Chưa có lịch bảo dưỡng nào</Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={onAddAppointment}
          >
            <Ionicons name="add" size={16} color="#4CAF50" />
            <Text style={styles.emptyStateButtonText}>Đặt lịch đầu tiên</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    marginRight: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  appointmentList: {},
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 15,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  emptyStateButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
});
