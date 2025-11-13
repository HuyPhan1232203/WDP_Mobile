// app/appointment/detail.tsx
import {
  cancelAppointment,
  clearCurrentAppointment,
  getAppointmentById,
  getMyAppointments,
} from "@/redux/feature/appointmentSlice";
import { updatePaymentStatus } from "@/redux/feature/paymentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg"; // Import QRCode
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { getPaymentInfo } from "../utils/badge";
const AppointmentDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const appointmentId = params.appointmentId as string;

  const { currentAppointment, loading, error } = useAppSelector(
    (state) => state.appointment
  );
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      dispatch(getAppointmentById(appointmentId));
    }
    return () => {
      dispatch(clearCurrentAppointment());
    };
  }, [appointmentId, dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
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

  const getStatusInfo = (status: string) => {
    const statusMap: {
      [key: string]: { label: string; color: string; icon: string };
    } = {
      pending: { label: "Chờ xác nhận", color: "#FF9800", icon: "time" },
      assigned: { label: "Đã phân công", color: "#2196F3", icon: "person" },
      check_in: { label: "Đã check-in", color: "#4CAF50", icon: "checkmark" },
      in_progress: {
        label: "Đang thực hiện",
        color: "#FF9800",
        icon: "construct",
      },
      repaired: { label: "Đã sửa chữa", color: "#4CAF50", icon: "wrench" },
      completed: {
        label: "Hoàn thành",
        color: "#4CAF50",
        icon: "checkmark-done-circle",
      },
      cancelled: { label: "Đã hủy", color: "#F44336", icon: "close-circle" },
    };
    return (
      statusMap[status] || { label: status, color: "#666", icon: "help-circle" }
    );
  };
  const handleCancel = async () => {
    try {
      await dispatch(cancelAppointment(appointmentId)).unwrap();
      setShowCancelModal(false);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Lịch hẹn đã được hủy",
      });
      router.back();
      dispatch(clearCurrentAppointment());
      dispatch(getMyAppointments({ page: 1, limit: 10 }));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể hủy lịch hẹn",
      });
    }
  };

  const handleOpenPayment = async () => {
    if (!currentAppointment?.payment_id?.checkoutUrl) {
      Alert.alert("Lỗi", "Không tìm thấy link thanh toán");
      return;
    }

    // Instead of Linking.openURL, show WebView modal
    setShowPaymentWebView(true);
  };
  const handlePaymentNavigationStateChange = async (navState: any) => {
    // Check if the URL indicates success or failure
    // Adjust the URLs based on your payment gateway's return URLs
    if (navState.url.includes("success") || navState.url.includes("return")) {
      // Payment successful
      const res = await dispatch(
        updatePaymentStatus({
          order_code: currentAppointment?.payment_id?.orderCode ?? 0,
          status: "paid",
        })
      );
      setShowPaymentWebView(false);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Thanh toán thành công",
      });
     
      console.log(res);
      await dispatch(getAppointmentById(appointmentId));
    } else if (
      navState.url.includes("cancel") ||
      navState.url.includes("failure")
    ) {
      // Payment failed or cancelled
      setShowPaymentWebView(false);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Thanh toán thất bại",
      });
    }
  };
  const handleCallCenter = async () => {
    if (!currentAppointment?.center_id?.phone) {
      Alert.alert("Lỗi", "Không tìm thấy số điện thoại");
      return;
    }

    try {
      const phoneNumber = currentAppointment.center_id.phone;

      // Remove spaces and special characters from phone number
      const cleanNumber = phoneNumber.replace(/[\s()-]/g, "");

      // Use telprompt for iOS to show confirmation dialog
      // Use tel for Android
      let url = "";
      if (Platform.OS === "ios") {
        url = `telprompt:${cleanNumber}`;
      } else {
        url = `tel:${cleanNumber}`;
      }

      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          "Không thể gọi điện",
          "Thiết bị của bạn không hỗ trợ tính năng gọi điện"
        );
        return;
      }

      // Open the URL
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening phone dialer:", error);
      // Swallow the error if user cancels the call
      // This is expected behavior, not a real error
    }
  };

  const handleOpenMap = async () => {
    if (!currentAppointment?.center_id?.address) {
      Alert.alert("Lỗi", "Không tìm thấy địa chỉ");
      return;
    }

    try {
      const address = encodeURIComponent(currentAppointment.center_id.address);

      // Different map URLs for iOS and Android
      let url = "";
      if (Platform.OS === "ios") {
        url = `maps://app?q=${address}`;
      } else {
        url = `geo:0,0?q=${address}`;
      }

      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        // Fallback to Google Maps web
        url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening maps:", error);
      Alert.alert("Lỗi", "Không thể mở bản đồ");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error || !currentAppointment) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
        <Text style={styles.errorText}>
          {error || "Không tìm thấy lịch hẹn"}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(currentAppointment.status);
  const canCancel =
    (currentAppointment.status === "pending" ||
      currentAppointment.status === "confirmed" ||
      currentAppointment.status === "accepted") &&
    currentAppointment.payment_id?.status !== "TIMEOUT";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push("/customerHome/customerHome")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lịch hẹn</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content}>
        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: statusInfo.color + "15" },
          ]}
        >
          <Ionicons
            name={statusInfo.icon as any}
            size={48}
            color={statusInfo.color}
          />
          <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
          <Text style={styles.appointmentId}>
            Mã lịch hẹn: {currentAppointment._id.slice(-8).toUpperCase()}
          </Text>
        </View>

        {/* Date & Time */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>Thời gian</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày</Text>
            <Text style={styles.infoValue}>
              {formatDate(currentAppointment.appoinment_date)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giờ</Text>
            <Text style={styles.infoValue}>
              {currentAppointment.appoinment_time}
            </Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="construct" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>Dịch vụ</Text>
          </View>
          <Text style={styles.serviceName}>
            {currentAppointment.service_type_id.service_name}
          </Text>
          <Text style={styles.serviceDescription}>
            {currentAppointment.service_type_id.description}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thời gian ước tính</Text>
            <Text style={styles.infoValue}>
              {currentAppointment.service_type_id.estimated_duration} giờ
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chi phí dịch vụ</Text>
            <Text style={[styles.infoValue, styles.priceText]}>
              {formatCurrency(currentAppointment.service_type_id.base_price)}
            </Text>
          </View>
          {currentAppointment.deposit_cost > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đặt cọc</Text>
              <Text style={[styles.infoValue, styles.priceText]}>
                {formatCurrency(currentAppointment.deposit_cost)}
              </Text>
            </View>
          )}
          {currentAppointment.final_cost > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tổng chi phí</Text>
              <Text style={[styles.infoValue, styles.priceText]}>
                {formatCurrency(currentAppointment.final_cost)}
              </Text>
            </View>
          )}
        </View>

        {/* Vehicle Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="car" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>Thông tin xe</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Biển số</Text>
            <Text style={styles.infoValue}>
              {currentAppointment.vehicle_id.license_plate}
            </Text>
          </View>
          {currentAppointment.vehicle_id.color && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Màu xe</Text>
              <Text style={styles.infoValue}>
                {currentAppointment.vehicle_id.color}
              </Text>
            </View>
          )}
        </View>
        {/* Customer Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>Thông tin khách hàng</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Họ tên</Text>
            <Text style={styles.infoValue}>
              {currentAppointment.user_id.fullName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {currentAppointment.user_id.email}
            </Text>
          </View>
        </View>
        {/* Center Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="business" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>Trung tâm bảo dưỡng</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.locationText}>
              {currentAppointment.center_id?.address}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCallCenter}
            >
              <Ionicons name="call" size={18} color="#4CAF50" />
              <Text style={styles.actionButtonText}>
                {currentAppointment.center_id?.phone}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleOpenMap}
            >
              <Ionicons name="navigate" size={18} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Chỉ đường</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Technician Info */}
        {currentAppointment.technician_id && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={20} color="#4CAF50" />
              <Text style={styles.cardTitle}>Kỹ thuật viên</Text>
            </View>
            <Text style={styles.infoTechnicianValue}>
              {typeof currentAppointment.technician_id === "object" &&
              currentAppointment.technician_id.fullName
                ? currentAppointment.technician_id.fullName
                : typeof currentAppointment.technician_id === "string"
                ? currentAppointment.technician_id
                : "Chưa phân công"}
            </Text>
          </View>
        )}

        {/* Notes */}
        {currentAppointment.notes && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text" size={20} color="#4CAF50" />
              <Text style={styles.cardTitle}>Ghi chú</Text>
            </View>
            <Text style={styles.notesText}>{currentAppointment.notes}</Text>
          </View>
        )}

        {/* Payment Info */}
        {currentAppointment.payment_id &&
          currentAppointment.status !== "accepted" && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="card" size={20} color="#4CAF50" />
                <Text style={styles.cardTitle}>Thanh toán</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mã đơn hàng</Text>
                <Text style={styles.infoValue}>
                  {currentAppointment.payment_id.orderCode}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số tiền đặt cọc</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(currentAppointment.payment_id.amount)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Trạng thái</Text>

                {currentAppointment.payment_id && (
                  <View style={styles.paymentBadge}>
                    {(() => {
                      const info = getPaymentInfo(
                        currentAppointment.payment_id.status
                      );
                      return (
                        <>
                          <Ionicons
                            name={info.icon as any}
                            size={12}
                            color={info.color}
                          />
                          <Text
                            style={[styles.paymentText, { color: info.color }]}
                          >
                            {info.label}
                          </Text>
                        </>
                      );
                    })()}
                  </View>
                )}
              </View>

              {currentAppointment.payment_id.status === "PENDING" && (
                <View style={styles.paymentActions}>
                  <TouchableOpacity
                    style={styles.qrButton}
                    onPress={() => setShowQRModal(true)}
                  >
                    <Ionicons name="qr-code" size={18} color="white" />
                    <Text style={styles.qrButtonText}>Xem mã QR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={handleOpenPayment}
                  >
                    <Ionicons name="card" size={18} color="white" />
                    <Text style={styles.payButtonText}>Thanh toán ngay</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

        {/* Cancel Button */}
        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowCancelModal(true)}
          >
            <Ionicons name="close-circle-outline" size={20} color="#F44336" />
            <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowQRModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.qrModalTitle}>Quét mã để thanh toán</Text>

            {/* Sử dụng QRCode component thay vì Image */}
            {currentAppointment.payment_id?.qrCode && (
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={currentAppointment.payment_id.qrCode}
                  size={250}
                  backgroundColor="white"
                  color="black"
                />
              </View>
            )}

            <Text style={styles.qrModalAmount}>
              {formatCurrency(currentAppointment.payment_id?.amount || 0)}
            </Text>

            <Text style={styles.qrModalSubtext}>
              Sử dụng ứng dụng ngân hàng để quét mã QR
            </Text>

            <TouchableOpacity
              style={styles.openPaymentButton}
              onPress={handleOpenPayment}
            >
              <Text style={styles.openPaymentButtonText}>
                Hoặc thanh toán trực tuyến
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showPaymentWebView}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowPaymentWebView(false)}
      >
        <SafeAreaView style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              style={styles.closeWebViewButton}
              onPress={() => setShowPaymentWebView(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>Thanh toán</Text>
          </View>
          <WebView
            source={{ uri: currentAppointment?.payment_id?.checkoutUrl || "" }}
            onNavigationStateChange={handlePaymentNavigationStateChange}
            style={styles.webView}
          />
        </SafeAreaView>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalContent}>
            <Ionicons name="alert-circle" size={64} color="#F44336" />
            <Text style={styles.cancelModalTitle}>Xác nhận hủy lịch?</Text>
            <Text style={styles.cancelModalText}>
              Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không
              thể hoàn tác.
            </Text>
            <View style={styles.cancelModalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButtonSecondary}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.cancelModalButtonSecondaryText}>Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelModalButtonPrimary}
                onPress={handleCancel}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.cancelModalButtonPrimaryText}>
                    Xác nhận
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AppointmentDetail;

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
  headerButton: {
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
  webViewContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  webViewHeader: {
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
  closeWebViewButton: {
    padding: 5,
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  paymentText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 5,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  appointmentId: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  infoTechnicianValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  priceText: {
    color: "#4CAF50",
    fontSize: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginLeft: 8,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f9f0",
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#4CAF50",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  paymentActions: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  qrButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
  },
  qrButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  payButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
  },
  payButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F44336",
  },
  cancelButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  qrModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 10,
  },
  qrCodeContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrModalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  qrModalSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  openPaymentButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  openPaymentButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  cancelModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  cancelModalText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  cancelModalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  cancelModalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cancelModalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  cancelModalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F44336",
    alignItems: "center",
  },
  cancelModalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
