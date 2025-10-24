// app/issue-reports/list.tsx

import {
  deleteIssueReport,
  fetchAllIssueReports,
  IssueReport,
} from "@/redux/feature/issueReportSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const IssueReportsList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector(
    (state) => state.issueReport
  );
  useEffect(() => {
    console.log(reports);
  }, [reports]);
  useEffect(() => {
    dispatch(fetchAllIssueReports());
  }, [dispatch]);

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

  const handleDelete = (reportId: string) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa báo cáo này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteIssueReport(reportId)).unwrap();
            Toast.show({
              type: "success",
              text1: "Thành công",
              text2: "Báo cáo đã được xóa",
            });
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Lỗi",
              text2: "Không thể xóa báo cáo",
            });
          }
        },
      },
    ]);
  };

  const renderReportItem = ({ item }: { item: IssueReport }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() =>
        router.push({
          pathname: "/issue-reports/detail",
          params: { reportId: item._id },
        })
      }
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.issueTypeContainer}>
          <Ionicons name="alert-circle" size={20} color="#F44336" />
          <Text style={styles.issueTypeName}>
            {item.issue_type_id.issue_name}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/issue-reports/edit",
                params: { reportId: item._id },
              })
            }
          >
            <Ionicons name="create-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item._id)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Appointment Info */}
      <View style={styles.appointmentInfo}>
        <Ionicons name="calendar-outline" size={14} color="#666" />
        <Text style={styles.appointmentText}>
          {formatDate(item.appointment_id.appoinment_date)} -{" "}
          {item.appointment_id.appoinment_time}
        </Text>
      </View>

      {/* Issue Description */}
      <Text style={styles.description} numberOfLines={2}>
        {item.issue_description}
      </Text>

      {/* Solution */}
      {item.solution_applied && (
        <View style={styles.solutionContainer}>
          <Text style={styles.solutionLabel}>Giải pháp:</Text>
          <Text style={styles.solutionText} numberOfLines={2}>
            {item.solution_applied}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.partsInfo}>
          <Ionicons name="construct-outline" size={14} color="#666" />
          <Text style={styles.partsCount}>
            {item.parts_used.length} linh kiện
          </Text>
        </View>
        <Text style={styles.totalCost}>{formatCurrency(item.total_cost)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && reports.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Báo cáo vấn đề</Text>
        <View style={styles.backButton} />
      </View>

      {/* List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={renderReportItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có báo cáo vấn đề nào</Text>
            <Text style={styles.emptySubtext}>
              Nhấn nút + để tạo báo cáo mới
            </Text>
          </View>
        }
        refreshing={loading}
        onRefresh={() => dispatch(fetchAllIssueReports())}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/issue-report/create")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default IssueReportsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 20,
  },
  reportCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  issueTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  issueTypeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
  },
  appointmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  solutionContainer: {
    backgroundColor: "#f0f9f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  solutionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
  },
  solutionText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  partsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  partsCount: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
  totalCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F44336",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#ccc",
  },
  // Floating Action Button
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
