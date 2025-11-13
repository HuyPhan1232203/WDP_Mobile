import { getAppointmentsByTechnician } from "@/redux/feature/appointmentSlice";
import { createCheckList } from "@/redux/feature/checkListSlice";
import { fetchAllIssueTypes } from "@/redux/feature/issueTypeSlice";
import { fetchAllParts } from "@/redux/feature/partSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";

interface PartItem {
  part_id: string;
  quantity: number;
}

const CreateCheckList = () => {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { parts, loading: partsLoading } = useAppSelector(
    (state) => state.part
  );

  const { technicianAppointments, loading: appointmentsLoading } =
    useAppSelector((state) => state.appointment);
  const { issueTypes, loading: issueTypesLoading } = useAppSelector(
    (state) => state.issueType
  );
  const { loading: checklistLoading } = useAppSelector(
    (state) => state.checklist
  );

  const [appointmentId, setAppointmentId] = useState("");
  const [issueTypeId, setIssueTypeId] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [solutionApplied, setSolutionApplied] = useState("");
  const [selectedParts, setSelectedParts] = useState<PartItem[]>([]);
  const [currentPartId, setCurrentPartId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("1");

  useEffect(() => {
    dispatch(fetchAllParts());
    dispatch(fetchAllIssueTypes());
    // Fetch appointments for technician
    console.log(userId);
    if (userId) {
      console.log("object");
      dispatch(
        getAppointmentsByTechnician({
          page: 1,
          limit: 10,
          technician_id: userId as string,
          status: "assigned",
        })
      );
    }
  }, [userId]);

  const appointmentItems = technicianAppointments.map((appointment) => ({
    label: `${appointment.service_type_id.service_name} - ${new Date(
      appointment.appoinment_date
    ).toLocaleDateString("vi-VN")}`,
    value: appointment._id,
  }));

  const partItems = parts.map((part) => ({
    label: `${part.part_name} - ${part.part_number}`,
    value: part._id,
  }));

  const issueTypeItems = issueTypes.map((issueType) => ({
    label: `${issueType.category} (${issueType.severity})`,
    value: issueType._id,
  }));

  const addPart = () => {
    if (!currentPartId) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn phụ tùng",
      });
      return;
    }

    const quantity = parseInt(currentQuantity);
    if (quantity <= 0) {
      Toast.show({
        type: "error",
        text1: "Số lượng phải lớn hơn 0",
      });
      return;
    }

    const existingIndex = selectedParts.findIndex(
      (p) => p.part_id === currentPartId
    );
    if (existingIndex !== -1) {
      const updatedParts = [...selectedParts];
      updatedParts[existingIndex].quantity = quantity;
      setSelectedParts(updatedParts);
    } else {
      setSelectedParts([
        ...selectedParts,
        { part_id: currentPartId, quantity },
      ]);
    }

    setCurrentPartId("");
    setCurrentQuantity("1");
  };

  const removePart = (partId: string) => {
    setSelectedParts(selectedParts.filter((p) => p.part_id !== partId));
  };

  const handleSubmit = async () => {
    if (
      !appointmentId ||
      !issueTypeId ||
      !issueDescription ||
      !solutionApplied
    ) {
      Toast.show({
        type: "error",
        text1: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    const checklistData = {
      appointment_id: appointmentId,
      issue_type_id: issueTypeId,
      issue_description: issueDescription,
      solution_applied: solutionApplied,
      parts: selectedParts,
    };

    try {
      console.log(JSON.stringify(checklistData));
      const res = await dispatch(createCheckList(checklistData)).unwrap();
      console.log(res);
      Toast.show({
        type: "success",
        text1: "Tạo checklist thành công!",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tạo checklist",
      });
    }
  };

  const getPartName = (partId: string) => {
    const part = parts.find((p) => p._id === partId);
    return part ? `${part.part_name} - ${part.part_number}` : "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo Checklist</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Appointment Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="calendar" size={16} /> Chọn lịch hẹn *
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.dropdownContainer}
              data={appointmentItems}
              search
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder={
                appointmentsLoading ? "Đang tải..." : "Chọn lịch hẹn"
              }
              searchPlaceholder="Tìm kiếm lịch hẹn..."
              value={appointmentId}
              onChange={(item) => setAppointmentId(item.value)}
            />
          </View>

          {/* Issue Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="warning" size={16} /> Loại sự cố *
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.dropdownContainer}
              data={issueTypeItems}
              search
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder={
                issueTypesLoading ? "Đang tải..." : "Chọn loại sự cố"
              }
              searchPlaceholder="Tìm kiếm..."
              value={issueTypeId}
              onChange={(item) => setIssueTypeId(item.value)}
            />
          </View>

          {/* Issue Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="document-text" size={16} /> Mô tả sự cố *
            </Text>
            <TextInput
              style={styles.textArea}
              value={issueDescription}
              onChangeText={setIssueDescription}
              placeholder="Nhập mô tả chi tiết sự cố..."
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Solution Applied */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="checkmark-circle" size={16} /> Giải pháp áp dụng *
            </Text>
            <TextInput
              style={styles.textArea}
              value={solutionApplied}
              onChangeText={setSolutionApplied}
              placeholder="Nhập giải pháp đã áp dụng..."
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Parts Section */}
          <View style={styles.partsSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="construct" size={18} /> Phụ tùng sử dụng
            </Text>

            <View style={styles.addPartForm}>
              <View style={styles.partDropdownContainer}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  containerStyle={styles.dropdownContainer}
                  data={partItems}
                  search
                  maxHeight={250}
                  labelField="label"
                  valueField="value"
                  placeholder={partsLoading ? "Đang tải..." : "Chọn phụ tùng"}
                  searchPlaceholder="Tìm kiếm..."
                  value={currentPartId}
                  onChange={(item) => setCurrentPartId(item.value)}
                />
              </View>

              <View style={styles.quantityContainer}>
                <TextInput
                  style={styles.quantityInput}
                  value={currentQuantity}
                  onChangeText={setCurrentQuantity}
                  placeholder="SL"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.addButton} onPress={addPart}>
                <Ionicons name="add-circle" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {selectedParts.length > 0 && (
              <View style={styles.selectedPartsList}>
                {selectedParts.map((item, index) => (
                  <View key={index} style={styles.partItem}>
                    <View style={styles.partInfo}>
                      <Text style={styles.partName}>
                        {getPartName(item.part_id)}
                      </Text>
                      <Text style={styles.partQuantity}>
                        Số lượng: {item.quantity}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removePart(item.part_id)}>
                      <Ionicons name="trash" size={20} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={checklistLoading}
        >
          {checklistLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Tạo Checklist</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateCheckList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,
  },
  dropdownContainer: {
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#333",
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 100,
    textAlignVertical: "top",
  },
  partsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  addPartForm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  partDropdownContainer: {
    flex: 1,
  },
  quantityContainer: {
    width: 70,
  },
  quantityInput: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    textAlign: "center",
    height: 50,
  },
  addButton: {
    padding: 8,
  },
  selectedPartsList: {
    gap: 10,
  },
  partItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  partQuantity: {
    fontSize: 13,
    color: "#666",
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
