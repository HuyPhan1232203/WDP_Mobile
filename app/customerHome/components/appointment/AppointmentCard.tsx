// components/home/AppointmentCard.tsx
import { Appointment } from "@/redux/feature/appointmentSlice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
const getStatusInfo = (status: string) => {
  const statusMap: { [key: string]: { label: string; color: string } } = {
    pending: { label: "Chờ xác nhận", color: "#FF9800" },
    assigned: { label: "Đã phân công", color: "#2196F3" },
    check_in: { label: "Đã check-in", color: "#4CAF50" },
    in_progress: { label: "Đang thực hiện", color: "#FF9800" },
    repaired: { label: "Đã sửa chữa", color: "#4CAF50" },
    completed: { label: "Hoàn thành", color: "#4CAF50" },
    cancelled: { label: "Đã hủy", color: "#F44336" },
  };
  return statusMap[status] || { label: status, color: "#666" };
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
}) => {
  const statusInfo = getStatusInfo(appointment.status);

  return (
    <TouchableOpacity style={styles.appointmentCard} onPress={onPress}>
      {/* Header */}
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentDateContainer}>
          <Ionicons name="calendar" size={16} color="#4CAF50" />
          <Text style={styles.appointmentDate}>
            {formatDate(appointment.appoinment_date)}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusInfo.color + "20" },
          ]}
        >
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      {/* Service info */}
      <Text style={styles.serviceName}>
        {appointment.service_type_id.service_name}
      </Text>

      {/* Details */}
      <View style={styles.appointmentInfo}>
        <View style={styles.appointmentRow}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.appointmentText}>
            {appointment.appoinment_time}
          </Text>
        </View>
        <View style={styles.appointmentRow}>
          <Ionicons name="car-outline" size={14} color="#666" />
          <Text style={styles.appointmentText}>
            {appointment.vehicle_id.license_plate}
          </Text>
        </View>
        <View style={styles.appointmentRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.appointmentText} numberOfLines={1}>
            {appointment.center_id.address}
          </Text>
        </View>
        <View style={styles.appointmentRow}>
          <Ionicons name="cash-outline" size={14} color="#666" />
          <Text style={styles.appointmentText}>
            {formatCurrency(appointment.estimated_cost)}
          </Text>
        </View>
      </View>

      {/* Payment status */}
      {appointment.payment_id && (
        <View style={styles.paymentInfo}>
          <Ionicons
            name="card-outline"
            size={14}
            color={
              appointment.payment_id.status === "pending"
                ? "#FF9800"
                : "#4CAF50"
            }
          />
          <Text
            style={[
              styles.paymentText,
              {
                color:
                  appointment.payment_id.status === "pending"
                    ? "#FF9800"
                    : "#4CAF50",
              },
            ]}
          >
            Thanh toán:{" "}
            {appointment.payment_id.status === "pending"
              ? "Chờ thanh toán"
              : "Đã thanh toán"}
          </Text>
        </View>
      )}

      <View style={styles.appointmentFooter}>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  appointmentDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  appointmentInfo: {
    marginBottom: 8,
  },
  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  appointmentText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  paymentText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
  appointmentFooter: {
    alignItems: "flex-end",
    marginTop: 5,
  },
});
