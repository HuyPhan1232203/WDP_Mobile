import {
  createAppointment,
  getMyAppointments,
} from "@/redux/feature/appointmentSlice";
import { Center, fetchCenters } from "@/redux/feature/centerSlice";
import { fetchServices } from "@/redux/feature/serviceSlice";
import { fetchUserVehicles } from "@/redux/feature/vehicleSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

const Service = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useAppSelector((state) => state.service);
  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
  } = useAppSelector((state) => state.vehicle);
  const {
    centers,
    loading: centersLoading,
    error: centersError,
  } = useAppSelector((state) => state.center);
  const { user } = useAppSelector((state) => state.user);
  const { loading: appointmentLoading } = useAppSelector(
    (state) => state.appointment
  );

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const vehicleItems = vehicles.map((vehicle) => ({
    label: `${vehicle.license_plate} - ${
      vehicle.model_id
        ? vehicle.model_id.brand + " " + vehicle.model_id.model_name
        : "Unknown Model"
    }`,
    value: vehicle._id,
  }));

  useEffect(() => {
    dispatch(fetchUserVehicles());
    dispatch(fetchServices());
    dispatch(fetchCenters());
    // dispatch(fetchUserProfile());
  }, []);

  const serviceItems = services?.map((service) => ({
    label: service.service_name,
    value: service._id,
  }));

  const centerItems = centers.map((center: Center) => ({
    label: center.center_name,
    value: center._id,
  }));

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date: Date) => {
    setAppointmentDate(date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time: Date) => {
    setAppointmentTime(time);
    hideTimePicker();
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const convertDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const convertTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  console.log(user);
  const handleBooking = async () => {
    if (
      !selectedVehicle ||
      !selectedService ||
      !selectedCenter ||
      !appointmentDate ||
      !appointmentTime ||
      !user
    ) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }
    const appointmentData = {
      appoinment_date: convertDate(appointmentDate),
      appoinment_time: convertTime(appointmentTime),
      notes: note,
      user_id: user._id,
      vehicle_id: selectedVehicle,
      center_id: selectedCenter,
      service_type_id: selectedService,
      technician_id: "", // Optional, set to empty or omit
    };

    try {
      const res = await dispatch(createAppointment(appointmentData)).unwrap();
      Toast.show({
        type: "success",
        text1: "Đặt lịch thành công!",
        text2: "Chúng tôi sẽ liên hệ với bạn sớm.",
      });
      router.back();
      dispatch(getMyAppointments({ page: 1, limit: 10 }));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể đặt lịch",
      });
    }
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
          onPress={() => {
            router.back();
          }}
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
            vehicleItems,
            (item) => setSelectedVehicle(item.value),
            vehiclesLoading ? "Đang tải..." : "Chọn xe của bạn"
          )}
          {renderDropdown(
            "Loại dịch vụ",
            selectedService,
            serviceItems,
            (item) => setSelectedService(item.value),
            servicesLoading ? "Đang tải..." : "Chọn loại dịch vụ"
          )}
          {renderDropdown(
            "Trung tâm bảo dưỡng",
            selectedCenter,
            centerItems,
            (item) => setSelectedCenter(item.value),
            centersLoading ? "Đang tải..." : "Chọn trung tâm"
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày và giờ</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ngày hẹn</Text>
            <TouchableOpacity style={styles.input} onPress={showDatePicker}>
              <Text style={styles.selectedTextStyle}>
                {formatDate(appointmentDate)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Giờ hẹn</Text>
            <TouchableOpacity style={styles.input} onPress={showTimePicker}>
              <Text style={styles.selectedTextStyle}>
                {formatTime(appointmentTime)}
              </Text>
            </TouchableOpacity>
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

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          disabled={appointmentLoading}
        >
          <Text style={styles.bookButtonText}>
            {appointmentLoading ? "Đang đặt..." : "Đặt lịch"}
          </Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
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
    justifyContent: "center",
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
