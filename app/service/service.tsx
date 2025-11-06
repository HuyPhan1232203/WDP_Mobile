import {
  createAppointment,
  getMyAppointments,
} from "@/redux/feature/appointmentSlice";
import {
  fetchCentersWithSchedule,
  parseDayOfWeek,
} from "@/redux/feature/centerSlice";
import { fetchServices } from "@/redux/feature/serviceSlice";
import { fetchAllUsers } from "@/redux/feature/userSlice";
import { fetchUserVehicles } from "@/redux/feature/vehicleSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const Service = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { services, loading: servicesLoading } = useAppSelector(
    (state) => state.service
  );
  const { vehicles, loading: vehiclesLoading } = useAppSelector(
    (state) => state.vehicle
  );
  const { centers, loading: centersLoading } = useAppSelector(
    (state) => state.center
  );
  useEffect(() => {
    console.log(centers);
  }, [centers]);
  const { allUsers, loadingAll: techniciansLoading } = useAppSelector(
    (state) => state.user
  );
  const { user } = useAppSelector((state) => state.user);
  const { loading: appointmentLoading } = useAppSelector(
    (state) => state.appointment
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    dispatch(fetchUserVehicles());
    dispatch(fetchServices());
    dispatch(fetchAllUsers({ page: 1, limit: 50 }));

    // Fetch centers with schedule for next 4 weeks
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 28);

    dispatch(
      fetchCentersWithSchedule({
        start_date: formatDateForAPI(today),
        end_date: formatDateForAPI(endDate),
      })
    );
  }, []);

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  const vehicleItems = vehicles.map((vehicle) => ({
    label: `${vehicle.license_plate} - ${
      vehicle.model_id
        ? vehicle.model_id.brand + " " + vehicle.model_id.model_name
        : "Unknown Model"
    }`,
    value: vehicle._id,
  }));

  const serviceItems = services?.map((service) => ({
    label: service.service_name,
    value: service._id,
  }));

  const technicianItems = allUsers
    .filter((user) => user.role === "technician")
    .map((user) => ({
      label: user.fullName,
      value: user._id,
    }));

  const selectedCenterData = centers.find((c) => c._id === selectedCenter);
  const selectedWeekData = selectedCenterData?.weeks?.find(
    (w) => w.week_number === selectedWeek
  );

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const handleNextStep = () => {
    if (currentStep === 1 && (!selectedVehicle || !selectedService)) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn xe và dịch vụ",
      });
      return;
    }
    if (currentStep === 2 && !selectedCenter) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn trung tâm",
      });
      return;
    }
    if (currentStep === 3 && (!selectedDate || !selectedTime)) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn ngày và giờ",
      });
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBooking = async () => {
    if (
      !selectedVehicle ||
      !selectedService ||
      !selectedCenter ||
      !selectedDate ||
      !selectedTime ||
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
      appoinment_date: selectedDate,
      appoinment_time: selectedTime,
      user_id: user._id,
      vehicle_id: selectedVehicle!,
      center_id: selectedCenter!,
      service_type_id: selectedService!,
      ...(note ? { notes: note } : {}),
      ...(selectedTechnician ? { technician_id: selectedTechnician } : {}),
    };
    console.log(JSON.stringify(appointmentData));
    try {
      const res = await dispatch(createAppointment(appointmentData)).unwrap();
      console.log(res);
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

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Chọn xe và dịch vụ</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          <Ionicons name="car" size={16} /> Chọn xe
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          data={vehicleItems}
          search
          maxHeight={250}
          labelField="label"
          valueField="value"
          placeholder={vehiclesLoading ? "Đang tải..." : "Chọn xe của bạn"}
          searchPlaceholder="Tìm kiếm..."
          value={selectedVehicle}
          onChange={(item) => setSelectedVehicle(item.value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          <Ionicons name="construct" size={16} /> Loại dịch vụ
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          data={serviceItems}
          search
          maxHeight={250}
          labelField="label"
          valueField="value"
          placeholder={servicesLoading ? "Đang tải..." : "Chọn loại dịch vụ"}
          searchPlaceholder="Tìm kiếm..."
          value={selectedService}
          onChange={(item) => setSelectedService(item.value)}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Chọn trung tâm bảo dưỡng</Text>

      {centersLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <View style={styles.centerList}>
          {centers.map((center) => (
            <TouchableOpacity
              key={center._id}
              style={[
                styles.centerCard,
                selectedCenter === center._id && styles.centerCardActive,
              ]}
              onPress={() => {
                setSelectedCenter(center._id);
                setSelectedWeek(null);
                setSelectedDate(null);
                setSelectedTime(null);
              }}
            >
              <View style={styles.centerHeader}>
                <Ionicons
                  name="business"
                  size={24}
                  color={selectedCenter === center._id ? "#4CAF50" : "#666"}
                />
                <Text style={styles.centerName}>{center.center_name}</Text>
              </View>
              <Text style={styles.centerAddress}>
                <Ionicons name="location" size={14} /> {center.address}
              </Text>
              <Text style={styles.centerPhone}>
                <Ionicons name="call" size={14} /> {center.phone}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Chọn ngày và giờ</Text>

      {/* Week Selection */}
      <View style={styles.weekSelector}>
        <Text style={styles.sectionLabel}>Chọn tuần</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedCenterData?.weeks?.map((week) => (
            <TouchableOpacity
              key={week.week_number}
              style={[
                styles.weekCard,
                selectedWeek === week.week_number && styles.weekCardActive,
              ]}
              onPress={() => {
                setSelectedWeek(week.week_number);
                setSelectedDate(null);
                setSelectedTime(null);
              }}
            >
              <Text style={styles.weekNumber}>Tuần {week.week_number}</Text>
              <Text style={styles.weekDate}>
                {formatDisplayDate(week.week_start)} -{" "}
                {formatDisplayDate(week.week_end)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date Selection */}
      {selectedWeek && (
        <View style={styles.dateSelector}>
          <Text style={styles.sectionLabel}>Chọn ngày</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedWeekData?.days.map((day) => (
              <TouchableOpacity
                key={day.date}
                style={[
                  styles.dateCard,
                  selectedDate === day.date && styles.dateCardActive,
                  day.is_close && styles.dateCardDisabled,
                ]}
                onPress={() => {
                  if (!day.is_close) {
                    setSelectedDate(day.date);
                    setSelectedTime(null);
                  }
                }}
                disabled={day.is_close}
              >
                <Text style={styles.dayOfWeek}>
                  {parseDayOfWeek(day.day_of_week)}
                </Text>
                <Text style={styles.dateText}>
                  {formatDisplayDate(day.date)}
                </Text>
                {day.is_close ? (
                  <Text style={styles.closedText}>Đóng cửa</Text>
                ) : (
                  <Text style={styles.slotsText}>
                    {day.availableSlots} slot
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Time Selection */}
      {selectedDate && (
        <View style={styles.timeSelector}>
          <Text style={styles.sectionLabel}>Chọn giờ</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotActive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Ionicons
                  name="time"
                  size={16}
                  color={selectedTime === time ? "#fff" : "#666"}
                />
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Xác nhận thông tin</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Ionicons name="car" size={20} color="#4CAF50" />
          <Text style={styles.summaryLabel}>Xe:</Text>
          <Text style={styles.summaryValue}>
            {vehicleItems.find((v) => v.value === selectedVehicle)?.label}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="construct" size={20} color="#4CAF50" />
          <Text style={styles.summaryLabel}>Dịch vụ:</Text>
          <Text style={styles.summaryValue}>
            {serviceItems.find((s) => s.value === selectedService)?.label}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="business" size={20} color="#4CAF50" />
          <Text style={styles.summaryLabel}>Trung tâm:</Text>
          <Text style={styles.summaryValue}>
            {selectedCenterData?.center_name}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="calendar" size={20} color="#4CAF50" />
          <Text style={styles.summaryLabel}>Ngày:</Text>
          <Text style={styles.summaryValue}>
            {selectedDate && formatDisplayDate(selectedDate)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="time" size={20} color="#4CAF50" />
          <Text style={styles.summaryLabel}>Giờ:</Text>
          <Text style={styles.summaryValue}>{selectedTime}</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          <Ionicons name="person" size={16} /> Người bảo dưỡng (tùy chọn)
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={technicianItems}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={
            techniciansLoading ? "Đang tải..." : "Chọn người bảo dưỡng"
          }
          searchPlaceholder="Tìm kiếm..."
          value={selectedTechnician}
          onChange={(item) => setSelectedTechnician(item.value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          <Ionicons name="document-text" size={16} /> Ghi chú (tùy chọn)
        </Text>
        <TextInput
          style={styles.textArea}
          value={note}
          onChangeText={setNote}
          placeholder="Nhập ghi chú nếu có..."
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch bảo dưỡng</Text>
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollView}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNextStep}>
            <Text style={styles.nextBtnText}>Tiếp tục</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleBooking}
            disabled={appointmentLoading}
          >
            {appointmentLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>Xác nhận đặt lịch</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "white",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: "#4CAF50",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
  },
  stepNumberActive: {
    color: "white",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E0E0E0",
  },
  stepLineActive: {
    backgroundColor: "#4CAF50",
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
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
  centerList: {
    gap: 12,
  },
  centerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  centerCardActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8F4",
  },
  centerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  centerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  centerAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  centerPhone: {
    fontSize: 14,
    color: "#666",
  },
  weekSelector: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  weekCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    minWidth: 120,
  },
  weekCardActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8F4",
  },
  weekNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  weekDate: {
    fontSize: 12,
    color: "#666",
  },
  dateSelector: {
    marginBottom: 20,
  },
  dateCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    minWidth: 80,
    alignItems: "center",
  },
  dateCardActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8F4",
  },
  dateCardDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.5,
  },
  dayOfWeek: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  closedText: {
    fontSize: 11,
    color: "#F44336",
  },
  slotsText: {
    fontSize: 11,
    color: "#4CAF50",
  },
  timeSelector: {
    marginBottom: 20,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeSlot: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: "30%",
  },
  timeSlotActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  timeTextActive: {
    color: "white",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    minWidth: 80,
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 15,
    color: "#333",
    textAlignVertical: "top",
    minHeight: 100,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    gap: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backBtn: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  nextBtn: {
    flex: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
