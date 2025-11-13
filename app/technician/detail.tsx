import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { completeCheckList } from "../../redux/feature/checkListSlice";

const TechnicianChecklistDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { item } = useLocalSearchParams();
  const checklist = JSON.parse(item as string);
  const { completing, success } = useSelector((state: any) => state.checklist);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityConfig = (severity: string) => {
    const configs: {
      [key: string]: { color: string; bg: string; label: string };
    } = {
      critical: { color: "#D32F2F", bg: "#FFEBEE", label: "Nghiêm trọng" },
      major: { color: "#F57C00", bg: "#FFF3E0", label: "Quan trọng" },
      moderate: { color: "#FBC02D", bg: "#FFFDE7", label: "Trung bình" },
      minor: { color: "#388E3C", bg: "#E8F5E9", label: "Nhẹ" },
    };
    return (
      configs[severity] || { color: "#757575", bg: "#F5F5F5", label: severity }
    );
  };

  const getStatusConfig = (status: string) => {
    const configs: {
      [key: string]: { color: string; bg: string; label: string };
    } = {
      pending: { color: "#F57C00", bg: "#FFF3E0", label: "Chờ xử lý" },
      accepted: { color: "#1976D2", bg: "#E3F2FD", label: "Đã chấp nhận" },
      rejected: { color: "#D32F2F", bg: "#FFEBEE", label: "Đã từ chối" },
      canceled: { color: "#757575", bg: "#F5F5F5", label: "Đã hủy" },
      completed: { color: "#388E3C", bg: "#E8F5E9", label: "Hoàn thành" },
    };
    return (
      configs[status] || {
        color: "#757575",
        bg: "#F5F5F5",
        label: status,
        icon: "ellipse",
      }
    );
  };

  const getAppointmentStatusConfig = (status: string) => {
    const configs: { [key: string]: { color: string; label: string } } = {
      pending: { color: "#F57C00", label: "Chờ xác nhận" },
      confirmed: { color: "#1976D2", label: "Đã xác nhận" },
      in_progress: { color: "#9C27B0", label: "Đang xử lý" },
      completed: { color: "#388E3C", label: "Hoàn thành" },
      cancelled: { color: "#757575", label: "Đã hủy" },
    };
    return configs[status] || { color: "#757575", label: status };
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      tire: "Lốp xe",
      charging: "Sạc điện",
      brake: "Phanh",
      motor: "Động cơ",
      battery: "Pin",
    };
    return labels[category] || category;
  };

  const severityConfig = getSeverityConfig(
    checklist.issue_type_id?.severity || "moderate"
  );
  const statusConfig = getStatusConfig(checklist.status);
  const appointmentStatus = getAppointmentStatusConfig(
    checklist.appointment_id?.status || "pending"
  );

  const handleComplete = () => {
    Alert.alert(
      "Xác nhận hoàn thành",
      "Bạn có chắc chắn muốn hoàn thành checklist này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Hoàn thành",
          onPress: async () => {
            const res = await dispatch(completeCheckList(checklist._id));
            if (completeCheckList.fulfilled.match(res)) {
              router.back();
              Toast.show({
                type: "success",
                text1: "Hoàn thành checklist thành công",
              });
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết Checklist</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{checklist._id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
            >
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày tạo:</Text>
            <Text style={styles.value}>{formatDate(checklist.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cập nhật:</Text>
            <Text style={styles.value}>{formatDate(checklist.updatedAt)}</Text>
          </View>
        </View>

        {/* Issue Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loại vấn đề</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Danh mục:</Text>
            <Text style={styles.value}>
              {getCategoryLabel(checklist.issue_type_id?.category)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mức độ:</Text>
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: severityConfig.bg },
              ]}
            >
              <Text
                style={[styles.severityText, { color: severityConfig.color }]}
              >
                {severityConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Issue Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả vấn đề</Text>
          <Text style={styles.descriptionText}>
            {checklist.issue_description}
          </Text>
        </View>

        {/* Solution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giải pháp áp dụng</Text>
          <Text style={styles.descriptionText}>
            {checklist.solution_applied}
          </Text>
        </View>

        {/* Parts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linh kiện</Text>
          {checklist.parts?.map((part: any, index: number) => (
            <View key={index} style={styles.partItem}>
              <Text style={styles.partName}>{part.part_id?.part_name}</Text>
              <Text style={styles.partDetail}>Số lượng: {part.quantity}</Text>
              <Text style={styles.partDetail}>
                Mã: {part.part_id?.part_number}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Cost */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng chi phí</Text>
          <Text style={styles.costText}>{checklist.total_cost} VND</Text>
        </View>

        {/* Appointment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin lịch hẹn</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày hẹn:</Text>
            <Text style={styles.value}>
              {formatDate(checklist.appointment_id?.appoinment_date)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <View
              style={[
                styles.appointmentStatusBadge,
                { backgroundColor: appointmentStatus.color + "20" },
              ]}
            >
              <Text
                style={[
                  styles.appointmentStatusText,
                  { color: appointmentStatus.color },
                ]}
              >
                {appointmentStatus.label}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Khách hàng:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.user_id?.fullName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kỹ thuật viên:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.technician_id?.fullName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Trung tâm:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.center_id?.center_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.center_id?.address}
            </Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin xe</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Biển số:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.vehicle_id?.license_plate}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Màu:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.vehicle_id?.color}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Model:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.vehicle_id?.model_id?.model_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Thương hiệu:</Text>
            <Text style={styles.value}>
              {checklist.appointment_id?.vehicle_id?.model_id?.brand}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Complete Button */}
      {checklist.status === "accepted" && checklist.status !== "completed" && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.completeButton, completing && styles.disabledButton]}
            onPress={handleComplete}
            disabled={completing}
          >
            <Text style={styles.completeButtonText}>
              {completing ? "Đang hoàn thành..." : "Hoàn thành"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TechnicianChecklistDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#212121",
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: 14,
    color: "#212121",
    lineHeight: 20,
  },
  partItem: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  partName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 4,
  },
  partDetail: {
    fontSize: 14,
    color: "#666",
  },
  costText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  appointmentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appointmentStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
