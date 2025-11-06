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

const Privacy = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chính sách bảo mật</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
          <Text style={styles.introTitle}>
            Cam kết bảo vệ thông tin của bạn
          </Text>
          <Text style={styles.introText}>
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
            người dùng
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Thu thập thông tin cá nhân</Text>
          <Text style={styles.paragraph}>
            Chúng tôi thu thập các thông tin sau khi bạn sử dụng dịch vụ:
          </Text>
          <Text style={styles.paragraph}>
            • Thông tin tài khoản: Họ tên, email, số điện thoại
          </Text>
          <Text style={styles.paragraph}>
            • Thông tin xe: Biển số, hãng xe, model, năm sản xuất
          </Text>
          <Text style={styles.paragraph}>
            • Thông tin đặt lịch: Địa chỉ, thời gian, loại dịch vụ
          </Text>
          <Text style={styles.paragraph}>
            • Thông tin thanh toán: Phương thức thanh toán (được mã hóa)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Mục đích sử dụng thông tin</Text>
          <Text style={styles.paragraph}>
            Thông tin của bạn được sử dụng để:
          </Text>
          <Text style={styles.paragraph}>
            • Cung cấp và cải thiện dịch vụ đặt lịch bảo dưỡng
          </Text>
          <Text style={styles.paragraph}>• Xử lý thanh toán và giao dịch</Text>
          <Text style={styles.paragraph}>
            • Gửi thông báo về lịch hẹn và cập nhật dịch vụ
          </Text>
          <Text style={styles.paragraph}>
            • Hỗ trợ khách hàng và giải quyết vấn đề
          </Text>
          <Text style={styles.paragraph}>
            • Phân tích và cải thiện trải nghiệm người dùng
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Bảo mật thông tin</Text>
          <Text style={styles.paragraph}>
            Chúng tôi áp dụng các biện pháp bảo mật:
          </Text>
          <Text style={styles.paragraph}>
            • Mã hóa dữ liệu SSL/TLS cho tất cả truyền tải
          </Text>
          <Text style={styles.paragraph}>
            • Lưu trữ dữ liệu trên server an toàn
          </Text>
          <Text style={styles.paragraph}>
            • Xác thực hai yếu tố cho các giao dịch quan trọng
          </Text>
          <Text style={styles.paragraph}>• Kiểm tra bảo mật định kỳ</Text>
          <Text style={styles.paragraph}>
            • Giới hạn quyền truy cập chỉ cho nhân viên được ủy quyền
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Chia sẻ thông tin</Text>
          <Text style={styles.paragraph}>
            Chúng tôi chỉ chia sẻ thông tin của bạn với:
          </Text>
          <Text style={styles.paragraph}>
            • Trung tâm bảo dưỡng đối tác (thông tin cần thiết để thực hiện dịch
            vụ)
          </Text>
          <Text style={styles.paragraph}>
            • Đối tác thanh toán (thông tin được mã hóa)
          </Text>
          <Text style={styles.paragraph}>
            • Cơ quan chức năng khi có yêu cầu pháp lý
          </Text>
          <Text style={styles.paragraph}>
            Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho bên
            thứ ba.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Quyền của người dùng</Text>
          <Text style={styles.paragraph}>Bạn có quyền:</Text>
          <Text style={styles.paragraph}>
            • Truy cập và xem thông tin cá nhân của mình
          </Text>
          <Text style={styles.paragraph}>
            • Yêu cầu chỉnh sửa hoặc cập nhật thông tin
          </Text>
          <Text style={styles.paragraph}>
            • Yêu cầu xóa tài khoản và dữ liệu
          </Text>
          <Text style={styles.paragraph}>
            • Từ chối nhận email marketing (vẫn nhận thông báo dịch vụ)
          </Text>
          <Text style={styles.paragraph}>
            • Yêu cầu sao lưu dữ liệu cá nhân
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cookie và theo dõi</Text>
          <Text style={styles.paragraph}>
            Ứng dụng sử dụng cookie và công nghệ tương tự để:
          </Text>
          <Text style={styles.paragraph}>• Ghi nhớ phiên đăng nhập</Text>
          <Text style={styles.paragraph}>
            • Phân tích hành vi sử dụng ứng dụng
          </Text>
          <Text style={styles.paragraph}>• Cá nhân hóa trải nghiệm</Text>
          <Text style={styles.paragraph}>
            Bạn có thể quản lý cookie trong cài đặt thiết bị.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Thời gian lưu trữ</Text>
          <Text style={styles.paragraph}>
            Chúng tôi lưu trữ thông tin của bạn trong thời gian:
          </Text>
          <Text style={styles.paragraph}>
            • Thông tin tài khoản: Cho đến khi bạn yêu cầu xóa
          </Text>
          <Text style={styles.paragraph}>
            • Lịch sử giao dịch: 5 năm theo quy định pháp luật
          </Text>
          <Text style={styles.paragraph}>
            • Dữ liệu phân tích: 2 năm (dạng ẩn danh)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Cập nhật chính sách</Text>
          <Text style={styles.paragraph}>
            Chính sách bảo mật có thể được cập nhật định kỳ. Chúng tôi sẽ thông
            báo về các thay đổi quan trọng qua email hoặc thông báo trong ứng
            dụng.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <View style={styles.contactHeader}>
            <Ionicons name="mail-outline" size={32} color="#4CAF50" />
            <Text style={styles.contactTitle}>Liên hệ về bảo mật</Text>
          </View>
          <Text style={styles.contactText}>
            Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
          </Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={16} color="#666" />
            <Text style={styles.contactValue}>privacy@evservice.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={16} color="#666" />
            <Text style={styles.contactValue}>Hotline: 1900 xxxx</Text>
          </View>
        </View>

        <View style={styles.updateInfo}>
          <Text style={styles.updateText}>Cập nhật lần cuối: 06/11/2025</Text>
          <Text style={styles.updateText}>Phiên bản: 1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Privacy;

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
  section: {
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
  contactSection: {
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
  contactHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  contactValue: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  updateInfo: {
    padding: 20,
    alignItems: "center",
  },
  updateText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 4,
  },
});
