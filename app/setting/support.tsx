import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

const Support = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const supportCategories = [
    {
      id: 1,
      title: "Vấn đề đặt lịch",
      icon: "calendar-outline",
      description: "Không thể đặt lịch hoặc gặp lỗi khi đặt",
    },
    {
      id: 2,
      title: "Vấn đề thanh toán",
      icon: "card-outline",
      description: "Giao dịch không thành công hoặc bị trừ tiền",
    },
    {
      id: 3,
      title: "Quản lý tài khoản",
      icon: "person-outline",
      description: "Đăng nhập, đổi mật khẩu, cập nhật thông tin",
    },
    {
      id: 4,
      title: "Quản lý xe",
      icon: "flash-sharp",
      description: "Thêm, sửa, xóa thông tin xe",
    },
    {
      id: 5,
      title: "Khác",
      icon: "help-circle-outline",
      description: "Các vấn đề khác",
    },
  ];

  const contactMethods = [
    {
      id: 1,
      title: "Hotline",
      value: "1900 xxxx",
      icon: "call",
      color: "#4CAF50",
      action: () => Linking.openURL("tel:1900xxxx"),
    },
    {
      id: 2,
      title: "Email",
      value: "support@evservice.com",
      icon: "mail",
      color: "#2196F3",
      action: () => Linking.openURL("mailto:support@evservice.com"),
    },
    {
      id: 3,
      title: "Facebook",
      value: "fb.com/evservice",
      icon: "logo-facebook",
      color: "#1877F2",
      action: () => Linking.openURL("https://facebook.com/evservice"),
    },
    {
      id: 4,
      title: "Zalo",
      value: "0901234567",
      icon: "chatbubbles",
      color: "#0068FF",
      action: () => {
        Toast.show({
          type: "info",
          text1: "Zalo",
          text2: "Đang mở ứng dụng Zalo...",
        });
      },
    },
  ];

  const faqItems = [
    {
      id: 1,
      question: "Làm thế nào để đặt lịch bảo dưỡng?",
      answer:
        "Vào mục 'Dịch vụ', chọn loại dịch vụ, chọn trung tâm và thời gian, sau đó xác nhận đặt lịch.",
    },
    {
      id: 2,
      question: "Có thể hủy lịch đã đặt không?",
      answer:
        "Có, bạn có thể hủy lịch trước thời gian hẹn ít nhất 24 giờ trong mục 'Lịch hẹn của tôi'.",
    },
    {
      id: 3,
      question: "Thanh toán như thế nào?",
      answer:
        "Bạn có thể thanh toán qua ví điện tử, chuyển khoản ngân hàng hoặc thanh toán trực tiếp tại trung tâm.",
    },
    {
      id: 4,
      question: "Làm sao để theo dõi trạng thái xe?",
      answer:
        "Vào mục 'Xe của tôi' để xem thông tin chi tiết và lịch sử bảo dưỡng của xe.",
    },
  ];

  const handleSubmitSupport = () => {
    if (!selectedCategory) {
      Alert.alert("Thông báo", "Vui lòng chọn danh mục");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập email của bạn");
      return;
    }
    if (!message.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập nội dung hỗ trợ");
      return;
    }

    // Simulate sending support request
    Toast.show({
      type: "success",
      text1: "Đã gửi yêu cầu",
      text2: "Chúng tôi sẽ phản hồi trong vòng 24h",
    });

    // Reset form
    setSelectedCategory("");
    setEmail("");
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hỗ trợ khách hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ nhanh</Text>
          <View style={styles.contactGrid}>
            {contactMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.contactCard}
                onPress={method.action}
              >
                <View
                  style={[
                    styles.contactIcon,
                    { backgroundColor: method.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={method.color}
                  />
                </View>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactValue}>{method.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gửi yêu cầu hỗ trợ</Text>

          {/* Category Selection */}
          <Text style={styles.label}>Chọn danh mục *</Text>
          <View style={styles.categoryList}>
            {supportCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.title &&
                    styles.categoryItemActive,
                ]}
                onPress={() => setSelectedCategory(category.title)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={20}
                  color={
                    selectedCategory === category.title ? "#4CAF50" : "#666"
                  }
                />
                <View style={styles.categoryContent}>
                  <Text
                    style={[
                      styles.categoryTitle,
                      selectedCategory === category.title &&
                        styles.categoryTitleActive,
                    ]}
                  >
                    {category.title}
                  </Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>
                {selectedCategory === category.title && (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Email Input */}
          <Text style={styles.label}>Email của bạn *</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Message Input */}
          <Text style={styles.label}>Nội dung *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Mô tả chi tiết vấn đề của bạn..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitSupport}
          >
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
          {faqItems.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <View style={styles.faqQuestion}>
                <Ionicons name="help-circle" size={20} color="#4CAF50" />
                <Text style={styles.faqQuestionText}>{item.question}</Text>
              </View>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Working Hours */}
        <View style={styles.workingHoursSection}>
          <Ionicons name="time-outline" size={32} color="#4CAF50" />
          <Text style={styles.workingHoursTitle}>Giờ làm việc</Text>
          <Text style={styles.workingHoursText}>
            Thứ 2 - Thứ 6: 8:00 - 18:00
          </Text>
          <Text style={styles.workingHoursText}>Thứ 7: 8:00 - 17:00</Text>
          <Text style={styles.workingHoursText}>Chủ nhật: Nghỉ</Text>
          <Text style={styles.workingHoursNote}>
            * Chúng tôi sẽ phản hồi trong vòng 24h làm việc
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Support;

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
  section: {
    backgroundColor: "white",
    marginBottom: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  contactCard: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },
  categoryList: {
    gap: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryItemActive: {
    backgroundColor: "#f0f9f0",
    borderColor: "#4CAF50",
  },
  categoryContent: {
    flex: 1,
    marginLeft: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  categoryTitleActive: {
    color: "#4CAF50",
  },
  categoryDescription: {
    fontSize: 12,
    color: "#999",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  faqItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginLeft: 28,
  },
  workingHoursSection: {
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
  workingHoursTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
    marginBottom: 15,
  },
  workingHoursText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  workingHoursNote: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 15,
    textAlign: "center",
  },
});
