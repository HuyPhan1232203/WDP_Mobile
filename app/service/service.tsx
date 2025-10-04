import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const Service = () => {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [note, setNote] = useState("");

  // Dummy data formatted for dropdown
  const vehicles = [
    { label: "Toyota Camry 2020", value: "Toyota Camry 2020" },
    { label: "Honda Civic 2019", value: "Honda Civic 2019" },
    { label: "Tesla Model 3", value: "Tesla Model 3" },
    { label: "BMW X5 2021", value: "BMW X5 2021" },
    { label: "Mercedes C-Class 2018", value: "Mercedes C-Class 2018" },
  ];
  const services = [
    { label: "Bảo dưỡng định kỳ", value: "Bảo dưỡng định kỳ" },
    { label: "Sửa chữa động cơ", value: "Sửa chữa động cơ" },
    { label: "Thay dầu", value: "Thay dầu" },
    { label: "Thay lốp", value: "Thay lốp" },
    { label: "Kiểm tra phanh", value: "Kiểm tra phanh" },
  ];
  const centers = [
    { label: "Trung tâm Hà Nội", value: "Trung tâm Hà Nội" },
    { label: "Trung tâm TP.HCM", value: "Trung tâm TP.HCM" },
    { label: "Trung tâm Đà Nẵng", value: "Trung tâm Đà Nẵng" },
    { label: "Trung tâm Cần Thơ", value: "Trung tâm Cần Thơ" },
    { label: "Trung tâm Hải Phòng", value: "Trung tâm Hải Phòng" },
  ];

  const handleBooking = () => {
    if (
      !selectedVehicle ||
      !selectedService ||
      !selectedCenter ||
      !appointmentDate ||
      !appointmentTime
    ) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    // Here you would typically send the booking data to your API
    Toast.show({
      type: "success",
      text1: "Đặt lịch thành công!",
      text2: "Chúng tôi sẽ liên hệ với bạn sớm.",
    });

    // Reset form or navigate
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const renderDropdown = (
    title: string,
    value: any,
    data: any[],
    onChange: (item: any) => void,
    placeholder: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{title}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Tìm kiếm..."
        value={value}
        onChange={onChange}
        renderLeftIcon={() => (
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.leftIcon}
          />
        )}
        renderRightIcon={() => (
          <Ionicons name="chevron-down" size={20} color="#999" />
        )}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch bảo dưỡng</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Chọn xe, dịch vụ và thời gian phù hợp
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>

          {renderDropdown(
            "Chọn xe",
            selectedVehicle,
            vehicles,
            (item) => setSelectedVehicle(item.value),
            "Chọn xe của bạn"
          )}
          {renderDropdown(
            "Loại dịch vụ",
            selectedService,
            services,
            (item) => setSelectedService(item.value),
            "Chọn loại dịch vụ"
          )}
          {renderDropdown(
            "Trung tâm bảo dưỡng",
            selectedCenter,
            centers,
            (item) => setSelectedCenter(item.value),
            "Chọn trung tâm"
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày và giờ</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ngày hẹn</Text>
            <TextInput
              style={styles.input}
              value={appointmentDate}
              onChangeText={setAppointmentDate}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Giờ hẹn</Text>
            <TextInput
              style={styles.input}
              value={appointmentTime}
              onChangeText={setAppointmentTime}
              placeholder="HH:MM"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ghi chú (tùy chọn)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="Nhập ghi chú nếu có..."
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Service;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
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
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dropdown: {
    height: 50,
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 10,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#333",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 15,
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
