import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export const AddVehicleModal = ({
  visible,
  onClose,
  models,
  loading,
  error,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  models: any[];
  loading: boolean;
  error: string | null;
  onSubmit: (data: any) => void;
}) => {
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [manufacturingYear, setManufacturingYear] = useState("");
  const [vin, setVin] = useState("");
  const [vehicleColor, setVehicleColor] = useState(null);
  const [currentMileage, setCurrentMileage] = useState("");

  const colors = [
    { label: "Trắng", value: "white" },
    { label: "Đen", value: "black" },
    { label: "Xám", value: "gray" },
    { label: "Đỏ", value: "red" },
    { label: "Xanh", value: "blue" },
  ];

  const modelItems = models.map((model) => ({
    label: `${model.brand} ${model.model_name} (${model.year})`,
    value: model._id,
  }));

  const handleSubmit = () => {
    if (!selectedModelId || !manufacturingYear || !vin || !vehicleColor) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    onSubmit({
      license_plate: vin,
      color: vehicleColor,
      purchase_date: new Date().toISOString().split("T")[0],
      current_mileage: parseInt(currentMileage) || 0,
      battery_health: 100,
      last_service_mileage: 0,
      model_id: selectedModelId,
    });

    // Reset form
    setSelectedModelId(null);
    setManufacturingYear("");
    setVin("");
    setVehicleColor(null);
    setCurrentMileage("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Thông tin xe điện</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalSubtitle}>
            Nhập thông tin chi tiết về xe điện của bạn
          </Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>
                Model xe <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={modelItems}
                labelField="label"
                valueField="value"
                placeholder={loading ? "Đang tải..." : "Chọn model xe"}
                value={selectedModelId}
                onChange={(item) => {
                  setSelectedModelId(item.value);
                }}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={20} color="#999" />
                )}
                disable={loading}
                search
                searchPlaceholder="Tìm kiếm model xe..."
                maxHeight={300}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>
                Năm sản xuất <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={manufacturingYear}
                onChangeText={setManufacturingYear}
                placeholder="2025"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Biển số xe <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={vin}
              onChangeText={setVin}
              placeholder="VD: 79A1-56789"
            />
            <Text style={styles.inputHint}>
              Biển số xe là mã định danh duy nhất
            </Text>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>
                Màu xe <Text style={styles.required}>*</Text>
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={colors}
                labelField="label"
                valueField="value"
                placeholder="Chọn màu xe"
                value={vehicleColor}
                onChange={(item) => {
                  setVehicleColor(item.value);
                }}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={20} color="#999" />
                )}
                maxHeight={300}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>Số km hiện tại</Text>
              <TextInput
                style={styles.input}
                value={currentMileage}
                onChangeText={setCurrentMileage}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          {error && (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          )}

          <View style={styles.noteSection}>
            <Text style={styles.noteTitle}>Lưu ý:</Text>
            <Text style={styles.noteText}>
              • Biển số xe không thể thay đổi sau khi lưu
            </Text>
            <Text style={styles.noteText}>
              • Số km hiện tại sẽ được sử dụng để tính toán lịch bảo dưỡng
            </Text>
            <Text style={styles.noteText}>
              • Thông tin này sẽ giúp chúng tôi đưa ra khuyến nghị bảo dưỡng phù
              hợp
            </Text>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Thêm xe</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#f44336",
  },
  input: {
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  inputHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#333",
  },
  noteSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
