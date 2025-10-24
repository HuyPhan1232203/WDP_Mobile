// app/issue-reports/create.tsx
import { getMyAppointments } from "@/redux/feature/appointmentSlice";
import {
  createIssueReport,
  type CreateIssueReportRequest,
} from "@/redux/feature/issueReportSlice";
import { fetchAllIssueTypes } from "@/redux/feature/issueTypeSlice";
import { fetchAllParts } from "@/redux/feature/partSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface PartUsed {
  part_id: string;
  quantity: number;
  unit_cost: number;
}

const IssueReportCreate = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.issueReport);
  const { issueTypes } = useAppSelector((state) => state.issueType);
  const { parts } = useAppSelector((state) => state.part);
  const { myAppointments } = useAppSelector((state) => state.appointment);

  const [formData, setFormData] = useState({
    appointment_id: "",
    issue_type_id: "",
    issue_description: "",
    solution_applied: "",
  });

  const [partsUsed, setPartsUsed] = useState<PartUsed[]>([]);
  const [showAddPart, setShowAddPart] = useState(false);
  const [selectedPart, setSelectedPart] = useState("");
  const [partQuantity, setPartQuantity] = useState("1");

  useEffect(() => {
    dispatch(fetchAllIssueTypes());
    dispatch(fetchAllParts());
    dispatch(getMyAppointments({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleAddPart = () => {
    if (!selectedPart) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn linh kiện",
      });
      return;
    }

    const part = parts.find((p) => p._id === selectedPart);
    if (!part) return;

    const quantity = parseInt(partQuantity) || 1;
    const newPart: PartUsed = {
      part_id: part._id,
      quantity: quantity,
      unit_cost: part.unit_price,
    };

    setPartsUsed([...partsUsed, newPart]);
    setSelectedPart("");
    setPartQuantity("1");
    setShowAddPart(false);
  };

  const handleRemovePart = (index: number) => {
    setPartsUsed(partsUsed.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.appointment_id) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn lịch hẹn",
      });
      return;
    }

    if (!formData.issue_type_id) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn loại vấn đề",
      });
      return;
    }

    if (!formData.issue_description.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập mô tả vấn đề",
      });
      return;
    }

    try {
      const reportData: CreateIssueReportRequest = {
        ...formData,
        parts_used: partsUsed,
      };

      await dispatch(createIssueReport(reportData)).unwrap();
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Báo cáo đã được tạo",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tạo báo cáo",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPartName = (partId: string) => {
    const part = parts.find((p) => p._id === partId);
    return part ? part.part_name : "";
  };

  const getTotalCost = () => {
    return partsUsed.reduce(
      (total, part) => total + part.quantity * part.unit_cost,
      0
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo báo cáo mới</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        {/* Appointment Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Lịch hẹn *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.appointment_id}
              onValueChange={(value) =>
                setFormData({ ...formData, appointment_id: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Chọn lịch hẹn" value="" />
              {myAppointments.map((apt) => (
                <Picker.Item
                  key={apt._id}
                  label={`${apt.service_type_id.service_name} - ${new Date(
                    apt.appoinment_date
                  ).toLocaleDateString("vi-VN")}`}
                  value={apt._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Issue Type Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Loại vấn đề *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.issue_type_id}
              onValueChange={(value) =>
                setFormData({ ...formData, issue_type_id: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Chọn loại vấn đề" value="" />
              {issueTypes.map((type) => (
                <Picker.Item
                  key={type._id}
                  label={type.issue_name}
                  value={type._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Issue Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mô tả vấn đề *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.issue_description}
            onChangeText={(text) =>
              setFormData({ ...formData, issue_description: text })
            }
            placeholder="Mô tả chi tiết vấn đề..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Solution Applied */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Giải pháp áp dụng</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.solution_applied}
            onChangeText={(text) =>
              setFormData({ ...formData, solution_applied: text })
            }
            placeholder="Mô tả giải pháp đã áp dụng..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Parts Used Section */}
        <View style={styles.partsSection}>
          <View style={styles.partsSectionHeader}>
            <Text style={styles.partsSectionTitle}>
              Linh kiện sử dụng ({partsUsed.length})
            </Text>
            <TouchableOpacity
              style={styles.addPartButton}
              onPress={() => setShowAddPart(!showAddPart)}
            >
              <Ionicons
                name={showAddPart ? "close" : "add"}
                size={20}
                color="#4CAF50"
              />
              <Text style={styles.addPartButtonText}>
                {showAddPart ? "Đóng" : "Thêm"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add Part Form */}
          {showAddPart && (
            <View style={styles.addPartForm}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedPart}
                  onValueChange={setSelectedPart}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn linh kiện" value="" />
                  {parts.map((part) => (
                    <Picker.Item
                      key={part._id}
                      label={`${part.part_name} - ${formatCurrency(
                        part.unit_price
                      )}`}
                      value={part._id}
                    />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.quantityInput}
                value={partQuantity}
                onChangeText={setPartQuantity}
                placeholder="Số lượng"
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.confirmAddButton}
                onPress={handleAddPart}
              >
                <Text style={styles.confirmAddButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Parts List */}
          {partsUsed.map((part, index) => (
            <View key={index} style={styles.partItem}>
              <View style={styles.partItemInfo}>
                <Text style={styles.partItemName}>
                  {getPartName(part.part_id)}
                </Text>
                <Text style={styles.partItemDetails}>
                  SL: {part.quantity} x {formatCurrency(part.unit_cost)}
                </Text>
              </View>
              <View style={styles.partItemActions}>
                <Text style={styles.partItemTotal}>
                  {formatCurrency(part.quantity * part.unit_cost)}
                </Text>
                <TouchableOpacity onPress={() => handleRemovePart(index)}>
                  <Ionicons name="trash-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Total Cost */}
          {partsUsed.length > 0 && (
            <View style={styles.totalCostContainer}>
              <Text style={styles.totalCostLabel}>Tổng chi phí:</Text>
              <Text style={styles.totalCostValue}>
                {formatCurrency(getTotalCost())}
              </Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.submitButtonText}>Tạo báo cáo</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default IssueReportCreate;

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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  partsSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  partsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  partsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addPartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addPartButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  addPartForm: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  quantityInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    marginVertical: 10,
  },
  confirmAddButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmAddButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  partItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  partItemInfo: {
    flex: 1,
  },
  partItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  partItemDetails: {
    fontSize: 12,
    color: "#666",
  },
  partItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  partItemTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  totalCostContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 2,
    borderTopColor: "#e0e0e0",
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalCostValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
});
