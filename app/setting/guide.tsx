import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const Guide = () => {
  const router = useRouter();

  const guideSteps = [
    {
      id: 1,
      title: "Đăng ký tài khoản",
      icon: "person-add-outline",
      steps: [
        "Nhấn vào nút 'Đăng ký' trên màn hình đăng nhập",
        "Điền đầy đủ thông tin cá nhân",
        "Xác nhận email để kích hoạt tài khoản",
      ],
    },
    {
      id: 2,
      title: "Đặt lịch bảo dưỡng",
      icon: "calendar-outline",
      steps: [
        "Chọn 'Đặt lịch' từ màn hình chính",
        "Chọn loại dịch vụ cần sử dụng",
        "Chọn trung tâm và thời gian phù hợp",
        "Xác nhận thông tin và hoàn tất đặt lịch",
      ],
    },
    {
      id: 3,
      title: "Quản lý xe",
      icon: "flash-sharp",
      steps: [
        "Vào mục 'Xe của tôi'",
        "Thêm thông tin xe bằng cách nhập biển số",
        "Xem lịch sử bảo dưỡng và nhắc nhở",
      ],
    },
    {
      id: 4,
      title: "Thanh toán",
      icon: "card-outline",
      steps: [
        "Chọn phương thức thanh toán phù hợp",
        "Nhập thông tin thanh toán (nếu cần)",
        "Xác nhận và hoàn tất giao dịch",
        "Lưu hóa đơn điện tử",
      ],
    },
    {
      id: 5,
      title: "Theo dõi lịch hẹn",
      icon: "time-outline",
      steps: [
        "Vào mục 'Lịch hẹn của tôi'",
        "Xem trạng thái các lịch hẹn",
        "Nhận thông báo khi có cập nhật",
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hướng dẫn sử dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Ionicons name="information-circle" size={48} color="#4CAF50" />
          <Text style={styles.introTitle}>Chào mừng đến với EV Service</Text>
          <Text style={styles.introText}>
            Hướng dẫn chi tiết giúp bạn sử dụng ứng dụng một cách hiệu quả nhất
          </Text>
        </View>

        {guideSteps.map((guide) => (
          <View key={guide.id} style={styles.guideCard}>
            <View style={styles.guideHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={guide.icon as any} size={24} color="#4CAF50" />
              </View>
              <Text style={styles.guideTitle}>{guide.title}</Text>
            </View>
            <View style={styles.stepsContainer}>
              {guide.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.supportSection}>
          <Ionicons name="help-circle-outline" size={32} color="#4CAF50" />
          <Text style={styles.supportTitle}>Cần thêm hỗ trợ?</Text>
          <Text style={styles.supportText}>
            Liên hệ với chúng tôi qua email: support@wdpmobile.com
          </Text>
          <Text style={styles.supportText}>Hotline: 1900 xxxx</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Guide;

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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  introSection: {
    backgroundColor: "white",
    padding: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 8,
    textAlign: "center",
  },
  introText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  guideCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f9f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  stepsContainer: {
    marginLeft: 8,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  supportSection: {
    backgroundColor: "white",
    margin: 20,
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
