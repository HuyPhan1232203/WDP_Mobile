import { createAppointment } from "@/redux/feature/appointmentSlice";
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
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("vi-VN")} VND`;
  };
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
  console.log(JSON.stringify(services));
  const serviceItems = services?.map((service) => ({
    label: `${service.service_name} - ${formatCurrency(service.base_price)}`,
    value: service._id,
  }));

  const selectedCenterData = centers.find((c) => c._id === selectedCenter);
  const selectedWeekData = selectedCenterData?.weeks?.find(
    (w) => w.week_number === selectedWeek
  );
  const selectedDayData = selectedWeekData?.days?.find(
    (d) => d.date === selectedDate
  );

  // Lấy technicians từ center đã chọn
  const technicianItems =
    selectedCenterData?.technicians
      ?.filter((tech) => tech.status === "on")
      .map((tech) => ({
        label: tech.user.fullName,
        value: tech.user._id,
      })) || [];

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
      const res = await dispatch(
        createAppointment(appointmentData as any)
      ).unwrap();
      Toast.show({
        type: "success",
        text1: "Đặt lịch thành công!",
        text2: "Chúng tôi sẽ liên hệ với bạn sớm.",
      });

      router.push(`/appointment/appointment?appointmentId=${res.data._id}`);
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
                setSelectedTechnician(null);
              }}
            >
              <View style={styles.centerHeader}>
                <Ionicons
                  name="business"
                  size={24}
                  color={selectedCenter === center._id ? "#4CAF50" : "#666"}
                />
                <Text
                  style={[
                    styles.centerName,
                    selectedCenter === center._id && styles.centerNameActive,
                  ]}
                >
                  {center.center_name}
                </Text>
              </View>
              <View style={styles.centerInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.centerAddress} numberOfLines={2}>
                    {center.address}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={14} color="#666" />
                  <Text style={styles.centerPhone}>{center.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="people" size={14} color="#666" />
                  <Text style={styles.technicianCount}>
                    {center.technicians?.filter((t) => t.status === "on")
                      .length || 0}{" "}
                    kỹ thuật viên
                  </Text>
                </View>
              </View>
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
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>
          <Ionicons name="calendar-outline" size={16} color="#333" /> Chọn tuần
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.weekList}>
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
                <Text
                  style={[
                    styles.weekNumber,
                    selectedWeek === week.week_number &&
                      styles.weekNumberActive,
                  ]}
                >
                  Tuần {week.week_number}
                </Text>
                <Text
                  style={[
                    styles.weekDate,
                    selectedWeek === week.week_number && styles.weekDateActive,
                  ]}
                >
                  {formatDisplayDate(week.week_start)} -{" "}
                  {formatDisplayDate(week.week_end)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Date Selection */}
      {selectedWeek && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            <Ionicons name="today-outline" size={16} color="#333" /> Chọn ngày
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateList}>
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
                  <Text
                    style={[
                      styles.dayOfWeek,
                      selectedDate === day.date && styles.dayOfWeekActive,
                      day.is_close && styles.textDisabled,
                    ]}
                  >
                    {parseDayOfWeek(day.day_of_week)}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === day.date && styles.dateTextActive,
                      day.is_close && styles.textDisabled,
                    ]}
                  >
                    {formatDisplayDate(day.date)}
                  </Text>
                  {day.is_close ? (
                    <View style={styles.closedBadge}>
                      <Text style={styles.closedText}>Đóng cửa</Text>
                    </View>
                  ) : (
                    <View style={styles.slotsBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color="#4CAF50"
                      />
                      <Text style={styles.slotsText}>
                        {day.remainingSlots} slot
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Time Selection */}
      {selectedDate && selectedDayData && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            <Ionicons name="time-outline" size={16} color="#333" /> Chọn giờ
          </Text>
          <View style={styles.timeGrid}>
            {selectedDayData.timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeSlot,
                  selectedTime === slot.time && styles.timeSlotActive,
                  slot.isFull && styles.timeSlotDisabled,
                ]}
                onPress={() => !slot.isFull && setSelectedTime(slot.time)}
                disabled={slot.isFull}
              >
                <Ionicons
                  name="time"
                  size={18}
                  color={
                    slot.isFull
                      ? "#ccc"
                      : selectedTime === slot.time
                      ? "#fff"
                      : "#4CAF50"
                  }
                />
                <View style={styles.timeInfo}>
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === slot.time && styles.timeTextActive,
                      slot.isFull && styles.textDisabled,
                    ]}
                  >
                    {slot.time}
                  </Text>
                  <Text
                    style={[
                      styles.availableText,
                      selectedTime === slot.time && styles.availableTextActive,
                      slot.isFull && styles.textDisabled,
                    ]}
                  >
                    {slot.isFull ? "Đã đầy" : `${slot.available} slot`}
                  </Text>
                </View>
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
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Xe</Text>
            <Text style={styles.summaryValue}>
              {vehicleItems.find((v) => v.value === selectedVehicle)?.label}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="construct" size={20} color="#4CAF50" />
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Dịch vụ</Text>
            <Text style={styles.summaryValue}>
              {serviceItems.find((s) => s.value === selectedService)?.label}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="business" size={20} color="#4CAF50" />
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Trung tâm</Text>
            <Text style={styles.summaryValue}>
              {selectedCenterData?.center_name}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="calendar" size={20} color="#4CAF50" />
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Ngày</Text>
            <Text style={styles.summaryValue}>
              {selectedDayData &&
                `${parseDayOfWeek(
                  selectedDayData.day_of_week
                )}, ${formatDisplayDate(selectedDate!)}`}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="time" size={20} color="#4CAF50" />
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Giờ</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
          </View>
        </View>
      </View>

      {technicianItems.length > 0 && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            <Ionicons name="person" size={16} /> Chọn kỹ thuật viên (tùy chọn)
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.dropdownContainer}
            data={technicianItems}
            search
            maxHeight={250}
            labelField="label"
            valueField="value"
            placeholder="Chọn kỹ thuật viên"
            searchPlaceholder="Tìm kiếm..."
            value={selectedTechnician}
            onChange={(item) => setSelectedTechnician(item.value)}
          />
        </View>
      )}

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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
    borderRadius: 16,
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
    marginBottom: 12,
  },
  centerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  centerNameActive: {
    color: "#4CAF50",
  },
  centerInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  centerAddress: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  centerPhone: {
    fontSize: 14,
    color: "#666",
  },
  technicianCount: {
    fontSize: 14,
    color: "#666",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  weekList: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 20,
  },
  weekCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    minWidth: 140,
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
  weekNumberActive: {
    color: "#4CAF50",
  },
  weekDate: {
    fontSize: 13,
    color: "#666",
  },
  weekDateActive: {
    color: "#4CAF50",
  },
  dateList: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 20,
  },
  dateCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    minWidth: 90,
    alignItems: "center",
  },
  dateCardActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8F4",
  },
  dateCardDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.6,
  },
  dayOfWeek: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },
  dayOfWeekActive: {
    color: "#4CAF50",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  dateTextActive: {
    color: "#4CAF50",
  },
  closedBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  closedText: {
    fontSize: 11,
    color: "#F44336",
    fontWeight: "600",
  },
  slotsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  slotsText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "48%",
  },
  timeSlotActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  timeSlotDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.6,
  },
  timeInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  timeTextActive: {
    color: "white",
  },
  availableText: {
    fontSize: 11,
    color: "#4CAF50",
    marginTop: 2,
  },
  availableTextActive: {
    color: "#E8F5E9",
  },
  textDisabled: {
    color: "#ccc",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    gap: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
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
    gap: 12,
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
