import {
  fetchAllModels,
  fetchUserVehicles,
  updateVehicle,
} from "@/redux/feature/vehicleSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";

const VehicleEdit = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { models, loading, error } = useAppSelector((state) => state.vehicle);

  const vehicle = JSON.parse(params.vehicle as string);
  const modelName = params.modelName as string;

  const [selectedModelId, setSelectedModelId] = useState(vehicle.model_id);
  const [manufacturingYear, setManufacturingYear] = useState(
    vehicle.purchase_date?.split("-")[0] || ""
  );
  const [vin, setVin] = useState(vehicle.license_plate || "");
  const [vehicleColor, setVehicleColor] = useState(vehicle.color || null);
  const [currentMileage, setCurrentMileage] = useState(
    vehicle.current_miliage?.toString() || ""
  );
  const [batteryHealth, setBatteryHealth] = useState(
    vehicle.battery_health?.toString() || ""
  );
  const [lastServiceMileage, setLastServiceMileage] = useState(
    vehicle.last_service_mileage?.toString() || ""
  );
  const [purchaseDate, setPurchaseDate] = useState(vehicle.purchase_date || "");

  const colors = [
    { label: "Trắng", value: "white" },
    { label: "Đen", value: "black" },
    { label: "Xám", value: "gray" },
    { label: "Đỏ", value: "red" },
    { label: "Xanh", value: "blue" },
  ];

  useEffect(() => {
    if (models.length === 0) {
      dispatch(fetchAllModels());
    }
  }, [dispatch, models.length]);

  const modelItems = models.map((model) => ({
    label: `${model.brand} ${model.model_name} (${model.year})`,
    value: model._id,
  }));

  const handleSubmit = async () => {
    if (!selectedModelId || !manufacturingYear || !vin || !vehicleColor) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    const updateData = {
      color: vehicleColor,
      current_miliage: parseInt(currentMileage) || 0,
      battery_health: parseInt(batteryHealth) || 100,
      last_service_mileage: parseInt(lastServiceMileage) || 0,
      purchase_date: purchaseDate,
    };

    try {
      await dispatch(updateVehicle({ id: vehicle._id, updateData })).unwrap();
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Xe đã được cập nhật",
      });
      dispatch(fetchUserVehicles());
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể cập nhật xe",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa xe</Text>
        <View />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Cập nhật thông tin chi tiết về xe điện của bạn
        </Text>
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Model xe</Text>
            <Text style={styles.displayText}>
              {modelName || "Unknown Model"}
            </Text>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.inputLabel}>Năm sản xuất</Text>
            <Text style={styles.displayText}>{manufacturingYear}</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Biển số xe</Text>
          <Text style={styles.displayText}>{vin}</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Màu xe</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={colors}
              labelField="label"
              valueField="value"
              placeholder="Chọn màu xe"
              value={vehicleColor}
              onChange={(item) => setVehicleColor(item.value)}
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
              placeholder="Số km hiện tại"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Tình trạng pin (%)</Text>
            <TextInput
              style={styles.input}
              value={batteryHealth}
              onChangeText={setBatteryHealth}
              placeholder="Tình trạng pin (%)"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.inputLabel}>Km bảo dưỡng cuối</Text>
            <TextInput
              style={styles.input}
              value={lastServiceMileage}
              onChangeText={setLastServiceMileage}
              placeholder="Km bảo dưỡng cuối"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ngày mua</Text>
          <TextInput
            style={styles.input}
            value={purchaseDate}
            onChangeText={setPurchaseDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {error && (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        )}

        <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
          <Text style={styles.updateButtonText}>Cập nhật xe</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default VehicleEdit;

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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  displayText: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#666",
  },
  subtitle: {
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
  input: {
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
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
  updateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
