import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/hero-ev-service.jpg")}
        style={styles.fixedBackground}
        imageStyle={styles.heroBackgroundImage}
      />
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="car-outline" size={24} color="#4CAF50" />
              <View>
                <Text style={styles.brandName}>EV Service</Text>
                <Text style={styles.brandSubtitle}>Management System</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerLoginButton}
                onPress={() => router.push("/login/login")}
              >
                <Feather name="user" size={24} color="#4CAF50" />
                <View>
                  <Text style={styles.loginText}>Đăng nhập</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroOverlay}>
              <View style={styles.heroContent}>
                <View style={styles.breadcrumb}>
                  <Ionicons name="home" size={16} color="#4CAF50" />
                  <Text style={styles.breadcrumbText}>
                    Hệ thống quản lý bảo dưỡng xe điện
                  </Text>
                </View>

                <Text style={styles.heroTitle}>
                  <Text style={styles.heroTitleGreen}>
                    EV Service Center{"\n"}
                  </Text>
                  <Text style={styles.heroTitleDark}>Management System</Text>
                </Text>

                <Text style={styles.heroDescription}>
                  Giải pháp toàn diện cho trung tâm dịch vụ xe điện - từ đặt
                  lịch bảo dưỡng đến quản lý quy trình, tối ưu hóa hiệu quả và
                  trải nghiệm khách hàng.
                </Text>

                <View style={styles.featuresList}>
                  <View style={styles.featuresColumn}>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4CAF50"
                      />
                      <Text style={styles.featureText}>
                        Quản lý lịch bảo dưỡng tự động
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4CAF50"
                      />
                      <Text style={styles.featureText}>
                        Đặt lịch dịch vụ online dễ dàng
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4CAF50"
                      />
                      <Text style={styles.featureText}>
                        Lịch sử bảo dưỡng chi tiết
                      </Text>
                    </View>
                  </View>
                  <View style={styles.featuresColumn}>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4CAF50"
                      />
                      <Text style={styles.featureText}>
                        Theo dõi trạng thái xe điện real-time
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4CAF50"
                      />
                      <Text style={styles.featureText}>
                        Thanh toán điện tử an toàn
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4CAF50"
                      />
                      <Text style={styles.featureText}>
                        Nhắc nhở bảo dưỡng thông minh
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => router.push("/login/login")}
                >
                  <Ionicons name="arrow-forward" size={20} color="white" />
                  <Text style={styles.ctaButtonText}>Đặt lịch bảo dưỡng</Text>
                </TouchableOpacity>
              </View>

              {/* Service Cards */}
              <View style={styles.serviceCards}>
                <View style={styles.serviceCard}>
                  <View style={styles.serviceIcon}>
                    <Ionicons name="flash" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.serviceTitle}>Công nghệ hiện đại</Text>
                  <Text style={styles.serviceDescription}>
                    Thiết bị chẩn đoán EV tân tiến
                  </Text>
                </View>

                <View style={styles.serviceCard}>
                  <View style={styles.serviceIcon}>
                    <Ionicons
                      name="shield-checkmark"
                      size={24}
                      color="#4CAF50"
                    />
                  </View>
                  <Text style={styles.serviceTitle}>Bảo hành toàn diện</Text>
                  <Text style={styles.serviceDescription}>
                    Cam kết chất lượng dịch vụ
                  </Text>
                </View>

                <View style={styles.serviceCard}>
                  <View style={styles.serviceIcon}>
                    <Ionicons name="time" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.serviceTitle}>Phục vụ 24/7</Text>
                  <Text style={styles.serviceDescription}>
                    Hỗ trợ khẩn cấp mọi lúc
                  </Text>
                </View>

                <View style={styles.serviceCard}>
                  <View style={styles.serviceIcon}>
                    <Ionicons name="people" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.serviceTitle}>Đội ngũ chuyên nghiệp</Text>
                  <Text style={styles.serviceDescription}>
                    Kỹ thuật viên được chứng nhận
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  loginText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  headerLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: 14,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  loginButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  heroSection: {
    minHeight: 600,
    position: "relative",
  },
  heroBackgroundImage: {
    opacity: 0.7,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroContent: {
    flex: 1,
    maxWidth: 600,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#4CAF50",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    lineHeight: 44,
  },
  heroTitleGreen: {
    color: "#4CAF50",
  },
  heroTitleDark: {
    color: "#333",
  },
  heroDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresList: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 30,
  },
  featuresColumn: {
    flex: 1,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    gap: 8,
  },
  ctaButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  serviceCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 40,
  },
  serviceCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "47%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f9f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
