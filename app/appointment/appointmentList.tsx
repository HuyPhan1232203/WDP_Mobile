import api from "@/config/axios";
import type { Appointment } from "@/redux/feature/appointmentSlice";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MyAppointmentsResponse {
  success: boolean;
  message: string;
  data: {
    items: Appointment[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
      has_next_page: boolean;
      has_prev_page: boolean;
    };
  };
}

interface FilterState {
  status?: string;
  date_from?: string;
  date_to?: string;
  is_working_now?: boolean;
}

const fetchAppointments = async ({
  pageParam = 1,
  filters,
}: {
  pageParam?: number;
  filters: FilterState;
}): Promise<MyAppointmentsResponse> => {
  const queryParams = new URLSearchParams({
    page: pageParam.toString(),
    limit: "10",
  });

  // Add filters only if they have values
  if (filters.status) {
    queryParams.append("status", filters.status);
  }
  if (filters.date_from) {
    queryParams.append("date_from", filters.date_from);
  }
  if (filters.date_to) {
    queryParams.append("date_to", filters.date_to);
  }
  if (filters.is_working_now === true) {
    queryParams.append("is_working_now", "true");
  }

  const response = await api.get<MyAppointmentsResponse>(
    `/appointment/myAppointment?${queryParams.toString()}`
  );
  return response.data;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDatePicker = (date: Date) => {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getStatusInfo = (status: string) => {
  const statusMap: { [key: string]: { label: string; color: string } } = {
    pending: { label: "Chờ xác nhận", color: "#FF9800" },
    accept: { label: "Đã chấp nhận", color: "#2196F3" },
    deposited: { label: "Đã đặt cọc", color: "#9C27B0" },
    completed: { label: "Hoàn thành", color: "#4CAF50" },
    paid: { label: "Đã thanh toán", color: "#4CAF50" },
    canceled: { label: "Đã hủy", color: "#F44336" },
  };
  return statusMap[status] || { label: status, color: "#666" };
};

const AppointmentList = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["appointments", filters],
    queryFn: ({ pageParam = 1 }) => fetchAppointments({ pageParam, filters }),
    getNextPageParam: (lastPage) => {
      const { has_next_page, current_page } = lastPage.data.pagination;
      return has_next_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const appointments = data?.pages.flatMap((page) => page.data.items) || [];

  const statusFilters = [
    { label: "Tất cả", value: undefined },
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đã chấp nhận", value: "accept" },
    { label: "Đã đặt cọc", value: "deposited" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Đã thanh toán", value: "paid" },
    { label: "Đã hủy", value: "canceled" },
  ];

  // Đếm filter đang active
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    const resetState = {};
    setTempFilters(resetState);
    setFilters(resetState);
    setShowFilterModal(false);
  };

  const handleDateFromChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "ios") {
      if (event.type === "set" && selectedDate) {
        setTempFilters((prev) => ({
          ...prev,
          date_from: formatDatePicker(selectedDate),
        }));
      }
    } else {
      // Android
      setShowDateFromPicker(false);
      if (event.type === "set" && selectedDate) {
        setTempFilters((prev) => ({
          ...prev,
          date_from: formatDatePicker(selectedDate),
        }));
      }
    }
  };

  const handleDateToChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "ios") {
      if (event.type === "set" && selectedDate) {
        setTempFilters((prev) => ({
          ...prev,
          date_to: formatDatePicker(selectedDate),
        }));
      }
    } else {
      // Android
      setShowDateToPicker(false);
      if (event.type === "set" && selectedDate) {
        setTempFilters((prev) => ({
          ...prev,
          date_to: formatDatePicker(selectedDate),
        }));
      }
    }
  };

  // Clear date filters
  const handleClearDateFrom = () => {
    setTempFilters((prev) => {
      const { date_from, ...rest } = prev;
      return rest;
    });
  };

  const handleClearDateTo = () => {
    setTempFilters((prev) => {
      const { date_to, ...rest } = prev;
      return rest;
    });
  };

  const renderAppointmentCard = ({ item }: { item: Appointment }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() =>
          router.push(`/appointment/appointment?appointmentId=${item._id}`)
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={16} color="#4CAF50" />
            <Text style={styles.dateText}>
              {formatDate(item.appoinment_date)}
            </Text>
            <Text style={styles.timeText}>{item.appoinment_time}</Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
          >
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>
        </View>

        <Text style={styles.serviceName}>
          {item.service_type_id.service_name}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={14} color="#666" />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.center_id.address}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="car-outline" size={14} color="#666" />
          <Text style={styles.infoText}>{item.vehicle_id.license_plate}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>
            {formatCurrency(item.estimated_cost)}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        {item.payment_id && (
          <View style={styles.paymentBadge}>
            <Ionicons
              name={
                item.payment_id.status === "PENDING"
                  ? "time-outline"
                  : "checkmark-circle"
              }
              size={12}
              color={
                item.payment_id.status === "PENDING" ? "#FF9800" : "#4CAF50"
              }
            />
            <Text
              style={[
                styles.paymentText,
                {
                  color:
                    item.payment_id.status === "PENDING"
                      ? "#FF9800"
                      : "#4CAF50",
                },
              ]}
            >
              {item.payment_id.status === "PENDING"
                ? "Chờ thanh toán"
                : "Đã thanh toán"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.filterBarContainer}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          setTempFilters(filters);
          setShowFilterModal(true);
        }}
      >
        <Ionicons name="funnel-outline" size={20} color="#4CAF50" />
        <Text style={styles.filterButtonText}>Bộ lọc</Text>
        {activeFilterCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Active filters display */}
      {Object.keys(filters).length > 0 && (
        <View style={styles.activeFiltersContainer}>
          {filters.status && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                {statusFilters.find((s) => s.value === filters.status)?.label}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setFilters((prev) => {
                    const { status, ...rest } = prev;
                    return rest;
                  })
                }
              >
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          {filters.date_from && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                Từ: {formatDate(filters.date_from)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setFilters((prev) => {
                    const { date_from, ...rest } = prev;
                    return rest;
                  })
                }
              >
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          {filters.date_to && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                Đến: {formatDate(filters.date_to)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setFilters((prev) => {
                    const { date_to, ...rest } = prev;
                    return rest;
                  })
                }
              >
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          {filters.is_working_now && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>Đang làm việc</Text>
              <TouchableOpacity
                onPress={() =>
                  setFilters((prev) => {
                    const { is_working_now, ...rest } = prev;
                    return rest;
                  })
                }
              >
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4CAF50" />
        <Text style={styles.footerLoaderText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Không có lịch hẹn nào</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
        <Text style={styles.errorText}>
          {error?.message || "Đã có lỗi xảy ra"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch hẹn của tôi</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={appointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={[
          styles.listContent,
          appointments.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal - CHỈ HIỂN THỊ KHI KHÔNG CÓ DATE PICKER */}
      {!showDateFromPicker && !showDateToPicker && (
        <Modal
          visible={showFilterModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.filterModal}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Bộ lọc nâng cao</Text>
                <View style={{ width: 24 }} />
              </View>

              {/* Filter Options */}
              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={true}
              >
                {/* Status Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Trạng thái</Text>
                  <View style={styles.statusFilterGrid}>
                    {statusFilters.map((item) => (
                      <TouchableOpacity
                        key={item.value || "all"}
                        style={[
                          styles.statusGridButton,
                          tempFilters.status === item.value &&
                            styles.statusGridButtonActive,
                        ]}
                        onPress={() =>
                          setTempFilters((prev) => ({
                            ...prev,
                            status: item.value,
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.statusGridButtonText,
                            tempFilters.status === item.value &&
                              styles.statusGridButtonTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Date Range Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>
                    Khoảng thời gian
                  </Text>

                  {/* From Date */}
                  <View style={styles.dateInputContainer}>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => {
                        setShowFilterModal(false);
                        setTimeout(() => setShowDateFromPicker(true), 300);
                      }}
                    >
                      <Ionicons name="calendar" size={18} color="#4CAF50" />
                      <Text style={styles.dateButtonText}>
                        {tempFilters.date_from
                          ? formatDate(tempFilters.date_from)
                          : "Từ ngày"}
                      </Text>
                    </TouchableOpacity>
                    {tempFilters.date_from && (
                      <TouchableOpacity
                        style={styles.clearDateButton}
                        onPress={handleClearDateFrom}
                      >
                        <Ionicons name="close-circle" size={20} color="#999" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* To Date */}
                  <View style={styles.dateInputContainer}>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => {
                        setShowFilterModal(false);
                        setTimeout(() => setShowDateToPicker(true), 300);
                      }}
                    >
                      <Ionicons name="calendar" size={18} color="#4CAF50" />
                      <Text style={styles.dateButtonText}>
                        {tempFilters.date_to
                          ? formatDate(tempFilters.date_to)
                          : "Đến ngày"}
                      </Text>
                    </TouchableOpacity>
                    {tempFilters.date_to && (
                      <TouchableOpacity
                        style={styles.clearDateButton}
                        onPress={handleClearDateTo}
                      >
                        <Ionicons name="close-circle" size={20} color="#999" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Working Now Toggle */}
                <View style={styles.filterSection}>
                  <View style={styles.toggleRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.filterSectionTitle}>
                        Đang làm việc
                      </Text>
                      <Text style={styles.toggleDescription}>
                        Hiển thị lịch hẹn đang được xử lý
                      </Text>
                    </View>
                    <Switch
                      value={tempFilters.is_working_now || false}
                      onValueChange={(value) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          is_working_now: value || undefined,
                        }))
                      }
                      trackColor={{ false: "#E0E0E0", true: "#81C784" }}
                      thumbColor={
                        tempFilters.is_working_now ? "#4CAF50" : "#F5F5F5"
                      }
                    />
                  </View>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetFilters}
                >
                  <Text style={styles.resetButtonText}>Xóa lọc</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyFilters}
                >
                  <Text style={styles.applyButtonText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Date Pickers for iOS */}
      {showDateFromPicker && Platform.OS === "ios" && (
        <Modal
          visible={showDateFromPicker}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowDateFromPicker(false);
            setTimeout(() => setShowFilterModal(true), 300);
          }}
        >
          <View style={styles.datePickerModalOverlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => {
                setShowDateFromPicker(false);
                setTimeout(() => setShowFilterModal(true), 300);
              }}
            />
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setShowDateFromPicker(false);
                    setTimeout(() => setShowFilterModal(true), 300);
                  }}
                >
                  <Text style={styles.datePickerCancel}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Chọn từ ngày</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowDateFromPicker(false);
                    setTimeout(() => setShowFilterModal(true), 300);
                  }}
                >
                  <Text style={styles.datePickerDone}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={
                  tempFilters.date_from
                    ? new Date(tempFilters.date_from)
                    : new Date()
                }
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setTempFilters((prev) => ({
                      ...prev,
                      date_from: formatDatePicker(date),
                    }));
                  }
                }}
                maximumDate={
                  tempFilters.date_to
                    ? new Date(tempFilters.date_to)
                    : undefined
                }
                textColor="#000"
              />
            </View>
          </View>
        </Modal>
      )}

      {showDateFromPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={
            tempFilters.date_from ? new Date(tempFilters.date_from) : new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateFromChange}
          maximumDate={
            tempFilters.date_to ? new Date(tempFilters.date_to) : undefined
          }
        />
      )}

      {showDateToPicker && Platform.OS === "ios" && (
        <Modal
          visible={showDateToPicker}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowDateToPicker(false);
            setTimeout(() => setShowFilterModal(true), 300);
          }}
        >
          <View style={styles.datePickerModalOverlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => {
                setShowDateToPicker(false);
                setTimeout(() => setShowFilterModal(true), 300);
              }}
            />
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setShowDateToPicker(false);
                    setTimeout(() => setShowFilterModal(true), 300);
                  }}
                >
                  <Text style={styles.datePickerCancel}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Chọn đến ngày</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowDateToPicker(false);
                    setTimeout(() => setShowFilterModal(true), 300);
                  }}
                >
                  <Text style={styles.datePickerDone}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={
                  tempFilters.date_to
                    ? new Date(tempFilters.date_to)
                    : new Date()
                }
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setTempFilters((prev) => ({
                      ...prev,
                      date_to: formatDatePicker(date),
                    }));
                  }
                }}
                minimumDate={
                  tempFilters.date_from
                    ? new Date(tempFilters.date_from)
                    : undefined
                }
                textColor="#000"
              />
            </View>
          </View>
        </Modal>
      )}

      {showDateToPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={
            tempFilters.date_to ? new Date(tempFilters.date_to) : new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateToChange}
          minimumDate={
            tempFilters.date_from ? new Date(tempFilters.date_from) : undefined
          }
        />
      )}
    </View>
  );
};

export default AppointmentList;

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
  filterBarContainer: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    gap: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  filterBadge: {
    marginLeft: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  statusScroll: {
    flexGrow: 0,
  },
  statusList: {
    paddingHorizontal: 5,
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statusButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  statusButtonTextActive: {
    color: "white",
  },
  listContent: {
    padding: 15,
  },
  emptyListContent: {
    flex: 1,
  },
  appointmentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  datePickerModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 0,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  datePickerCancel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  datePickerDone: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  paymentText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 5,
  },
  footerLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  footerLoaderText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 15,
    marginBottom: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%", // Thay đổi từ height sang maxHeight
    minHeight: 500, // Đảm bảo có chiều cao tối thiểu
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statusFilterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5, // Để tạo gap đều
  },
  statusGridButton: {
    width: "48%", // Thay đổi từ flex: 0.48
    marginHorizontal: "1%", // Tạo gap giữa các button
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  statusGridButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  statusGridButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  statusGridButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flex: 1, // Thêm để button chiếm hết không gian
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1, // Cho phép text mở rộng
  },
  dateInputContainer: {
    position: "relative",
    marginBottom: 12,
    flexDirection: "row", // Thêm
    alignItems: "center", // Thêm
  },
  clearDateButton: {
    padding: 8, // Tăng vùng chạm
    marginLeft: -40, // Đặt vào trong button
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  toggleDescription: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16, // Safe area cho iOS
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "white",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },

  // Active Filters - IMPROVED
  activeFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
});
