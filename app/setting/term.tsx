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

const Terms = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều khoản & Điều lệ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Điều khoản chung</Text>
          <Text style={styles.paragraph}>
            Chào mừng bạn đến với ứng dụng WDP Mobile. Bằng việc sử dụng dịch vụ
            của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được
            nêu dưới đây.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Quyền và trách nhiệm</Text>
          <Text style={styles.paragraph}>
            • Người dùng có trách nhiệm cung cấp thông tin chính xác khi đăng ký
            tài khoản.
          </Text>
          <Text style={styles.paragraph}>
            • Bảo mật thông tin tài khoản và không chia sẻ cho bên thứ ba.
          </Text>
          <Text style={styles.paragraph}>
            • Sử dụng dịch vụ đúng mục đích và tuân thủ pháp luật hiện hành.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Dịch vụ cung cấp</Text>
          <Text style={styles.paragraph}>
            Ứng dụng cung cấp dịch vụ đặt lịch bảo dưỡng và sửa chữa xe điện,
            bao gồm:
          </Text>
          <Text style={styles.paragraph}>
            • Đặt lịch hẹn với các trung tâm bảo dưỡng
          </Text>
          <Text style={styles.paragraph}>
            • Theo dõi trạng thái xe và lịch sử bảo dưỡng
          </Text>
          <Text style={styles.paragraph}>• Thanh toán trực tuyến</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Chính sách hủy lịch</Text>
          <Text style={styles.paragraph}>
            • Khách hàng có thể hủy lịch hẹn trước thời gian đặt lịch ít nhất 24
            giờ.
          </Text>
          <Text style={styles.paragraph}>
            • Phí hủy lịch có thể được áp dụng tùy theo chính sách của từng
            trung tâm.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Giới hạn trách nhiệm</Text>
          <Text style={styles.paragraph}>
            WDP Mobile không chịu trách nhiệm về chất lượng dịch vụ được cung
            cấp bởi các trung tâm bảo dưỡng đối tác. Mọi tranh chấp sẽ được giải
            quyết trực tiếp giữa khách hàng và trung tâm.
          </Text>
        </View>

        <View style={styles.updateInfo}>
          <Text style={styles.updateText}>Cập nhật lần cuối: 06/11/2025</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Terms;

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
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 8,
  },
  updateInfo: {
    padding: 20,
    alignItems: "center",
  },
  updateText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});
