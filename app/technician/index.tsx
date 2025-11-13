import {
  completeCheckList,
  getCheckLists,
} from "@/redux/feature/checkListSlice";
import { fetchUserProfile } from "@/redux/feature/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const TechnicianCheckList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { checklists, pagination, loading, completing } = useAppSelector(
    (state) => state.checklist
  );

  const { user, loading: userLoading } = useAppSelector((state) => state.user);

  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      loadChecklists(1, user._id);
    }
  }, [user?._id]);
  console.log(checklists);
  const loadChecklists = async (page: number, userId: string) => {
    if (!userId) return;

    try {
      await dispatch(
        getCheckLists({
          page,
          limit: 10,
          technician_id: userId,
        })
      ).unwrap();
      setCurrentPage(page);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải danh sách checklist",
      });
    }
  };

  const handleRefresh = async () => {
    if (!user?._id) return;
    setRefreshing(true);
    await loadChecklists(1, user._id);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination?.has_next_page && !loading && user?._id) {
      loadChecklists(currentPage + 1, user._id);
    }
  };

  const handleCompletePress = (checklist: any) => {
    setSelectedChecklist(checklist);
    setShowCompleteModal(true);
  };

  const handleConfirmComplete = async () => {
    if (!selectedChecklist || !user?._id) return;

    try {
      await dispatch(completeCheckList(selectedChecklist._id)).unwrap();
      Toast.show({
        type: "success",
        text1: "Hoàn thành checklist thành công!",
      });
      setShowCompleteModal(false);
      setSelectedChecklist(null);
      await loadChecklists(1, user._id);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể hoàn thành checklist",
      });
    }
  };

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

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      tire: "bicycle",
      charging: "battery-charging",
      brake: "hand-left",
      motor: "settings",
      battery: "battery-half",
    };
    return icons[category] || "build";
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
      [key: string]: { color: string; bg: string; label: string; icon: string };
    } = {
      pending: {
        color: "#F57C00",
        bg: "#FFF3E0",
        label: "Chờ xử lý",
        icon: "time",
      },
      accepted: {
        color: "#1976D2",
        bg: "#E3F2FD",
        label: "Đã chấp nhận",
        icon: "checkmark-circle",
      },
      canceled: {
        color: "#757575",
        bg: "#F5F5F5",
        label: "Đã hủy",
        icon: "ban",
      },
      completed: {
        color: "#388E3C",
        bg: "#E8F5E9",
        label: "Hoàn thành",
        icon: "checkmark-done-circle",
      },
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
    const statusMap: {
      [key: string]: { label: string; color: string; icon: string };
    } = {
      pending: { label: "Chờ xác nhận", color: "#FF9800", icon: "time" },
      assigned: { label: "Đã phân công", color: "#2196F3", icon: "person" },
      check_in: { label: "Đã check-in", color: "#4CAF50", icon: "checkmark" },
      in_progress: {
        label: "Đang thực hiện",
        color: "#FF9800",
        icon: "construct",
      },
      repaired: { label: "Đã sửa chữa", color: "#4CAF50", icon: "wrench" },
      completed: {
        label: "Hoàn thành",
        color: "#4CAF50",
        icon: "checkmark-done-circle",
      },
      cancelled: { label: "Đã hủy", color: "#F44336", icon: "close-circle" },
    };
    return (
      statusMap[status] || { label: status, color: "#666", icon: "help-circle" }
    );
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

  const filteredChecklists = checklists.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  const renderCheckListItem = ({ item }: { item: any }) => {
    const severityConfig = getSeverityConfig(
      item.issue_type_id?.severity || "moderate"
    );
    const statusConfig = getStatusConfig(item.status);
    const appointmentStatus = getAppointmentStatusConfig(
      item.appointment_id?.status || "pending"
    );

    return (
      <TouchableOpacity
        style={styles.checklistCard}
        activeOpacity={0.7}
        onPress={() =>
          router.push(
            `/technician/detail?item=${encodeURIComponent(
              JSON.stringify(item)
            )}`
          )
        }
      >
        {/* Header with category and date */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryContainer}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: severityConfig.bg },
              ]}
            >
              <Ionicons
                name={getCategoryIcon(item.issue_type_id?.category) as any}
                size={20}
                color={severityConfig.color}
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>
                {getCategoryLabel(item.issue_type_id?.category)}
              </Text>
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
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>

        {/* Appointment Info */}
        <View style={styles.appointmentSection}>
          <View style={styles.appointmentRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.appointmentLabel}>Lịch hẹn:</Text>
            <Text style={styles.appointmentDate}>
              {formatAppointmentDate(item.appointment_id?.appoinment_date)}
            </Text>
          </View>
          <View
            style={[
              styles.appointmentStatusBadge,
              { backgroundColor: appointmentStatus.color + "20" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: appointmentStatus.color },
              ]}
            />
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

        {/* Issue Description */}
        <View style={styles.descriptionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={16} color="#666" />
            <Text style={styles.sectionTitle}>Mô tả vấn đề</Text>
          </View>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {item.issue_description}
          </Text>
        </View>
        {/* Footer with status and action */}
        <View style={styles.cardFooter}>
          <View
            style={[styles.statusChip, { backgroundColor: statusConfig.bg }]}
          >
            <Ionicons
              name={statusConfig.icon as any}
              size={14}
              color={statusConfig.color}
            />
            <Text
              style={[styles.statusChipText, { color: statusConfig.color }]}
            >
              {statusConfig.label}
            </Text>
          </View>

          {item.status === "accepted" && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompletePress(item)}
            >
              <Ionicons name="checkmark-done" size={16} color="white" />
              <Text style={styles.completeButtonText}>Hoàn thành</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="clipboard-outline" size={64} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>Chưa có checklist nào</Text>
      <Text style={styles.emptyText}>
        {filterStatus === "all"
          ? "Nhấn nút + để tạo checklist mới"
          : `Không có checklist với trạng thái "${
              getStatusConfig(filterStatus).label
            }"`}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4CAF50" />
        <Text style={styles.footerLoaderText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderFilterButton = (status: string, label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive,
      ]}
      onPress={() => setFilterStatus(status)}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={filterStatus === status ? "#4CAF50" : "#999"}
      />
      <Text
        style={[
          styles.filterButtonText,
          filterStatus === status && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (userLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý Checklist</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/setting/setting")}
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Technician Info Card */}
      <View style={styles.technicianCard}>
        <View style={styles.technicianAvatar}>
          <Ionicons name="person" size={28} color="#4CAF50" />
        </View>
        <View style={styles.technicianInfo}>
          <Text style={styles.technicianName}>{user.fullName}</Text>
          <Text style={styles.technicianRole}>Kỹ thuật viên</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsNumber}>{filteredChecklists.length}</Text>
          <Text style={styles.statsLabel}>
            {filterStatus === "all" ? "Tổng" : "Đang lọc"}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabs}>
            {renderFilterButton("all", "Tất cả", "grid-outline")}
            {renderFilterButton("pending", "Chờ xử lý", "time-outline")}
            {renderFilterButton(
              "accepted",
              "Đã chấp nhận",
              "checkmark-circle-outline"
            )}
            {renderFilterButton(
              "completed",
              "Hoàn thành",
              "checkmark-done-outline"
            )}
            {renderFilterButton("canceled", "Đã hủy", "close-circle-outline")}
          </View>
        </ScrollView>
      </View>

      {/* Checklist List */}
      <FlatList
        data={filteredChecklists}
        renderItem={renderCheckListItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/technician/create?userId=${user._id}`)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Complete Confirmation Modal */}
      <Modal
        visible={showCompleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <View style={styles.modalIcon}>
                <Ionicons name="checkmark-circle" size={56} color="#4CAF50" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Xác nhận hoàn thành</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn đánh dấu checklist này là hoàn thành không?
            </Text>

            {selectedChecklist && (
              <View style={styles.checklistPreview}>
                <View style={styles.previewRow}>
                  <Ionicons name="document-text" size={16} color="#666" />
                  <Text style={styles.previewLabel}>Vấn đề:</Text>
                </View>
                <Text style={styles.previewValue} numberOfLines={2}>
                  {selectedChecklist.issue_description}
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCompleteModal(false);
                  setSelectedChecklist(null);
                }}
                disabled={completing}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmComplete}
                disabled={completing}
              >
                {completing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                    <Text style={styles.confirmButtonText}>Xác nhận</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TechnicianCheckList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8F0", // Softer green background for friendliness
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8F0",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
  },
  settingsButton: {
    padding: 8,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  technicianCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  technicianAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  technicianInfo: {
    flex: 1,
  },
  technicianName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 4,
  },
  technicianRole: {
    fontSize: 14,
    color: "#757575",
  },
  statsBox: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statsLabel: {
    fontSize: 12,
    color: "#388E3C",
    marginTop: 2,
  },
  filterContainer: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "#E8F5E9",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  checklistCard: {
    backgroundColor: "white",
    borderRadius: 20, // More rounded for friendliness
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3, // Slightly higher shadow
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 4,
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  appointmentSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  appointmentLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    marginRight: 4,
  },
  appointmentDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#212121",
  },
  appointmentStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  appointmentStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  descriptionSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  descriptionText: {
    fontSize: 14,
    color: "#212121",
    lineHeight: 20,
  },
  solutionSection: {
    padding: 16,
    backgroundColor: "#F1F8F4",
  },
  solutionText: {
    fontSize: 14,
    color: "#212121",
    lineHeight: 20,
  },
  partsSection: {
    padding: 16,
  },
  partsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  partCard: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  partName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  partQuantity: {
    fontSize: 11,
    color: "#fff",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  completeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#757575",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#BDBDBD",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerLoaderText: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 64, // Slightly larger
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8, // Higher elevation
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#212121",
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  checklistPreview: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  previewValue: {
    fontSize: 14,
    color: "#212121",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});
