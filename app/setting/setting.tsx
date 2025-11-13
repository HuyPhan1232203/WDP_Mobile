import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { tokenStorage } from "@/utils/tokenStorage";
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
import Toast from "react-native-toast-message";

const Settings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);
  console.log(user);
  const handleLogout = async () => {
    try {
      await tokenStorage.removeToken();
      Toast.show({
        type: "success",
        text1: "Đăng xuất thành công",
      });
      router.push("/login/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể đăng xuất",
      });
    }
  };

  const settingsMenu = [
    {
      id: 1,
      title: "Điều khoản & Điều lệ",
      icon: "document-text-outline",
      onPress: () => router.push("/setting/term"),
    },
    {
      id: 2,
      title: "Hướng dẫn sử dụng",
      icon: "help-circle-outline",
      onPress: () => router.push("/setting/guide"),
    },
    {
      id: 3,
      title: "Chính sách bảo mật",
      icon: "shield-checkmark-outline",
      onPress: () => router.push("/setting/privacy"),
    },
    {
      id: 4,
      title: "Liên hệ hỗ trợ",
      icon: "chatbubble-outline",
      onPress: () => router.push("/setting/support"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Đang tải...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : user ? (
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person-circle" size={60} color="#4CAF50" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.fullName}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Tên đăng nhập</Text>
                  <Text style={styles.value}>{user.username}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.label}>Số điện thoại</Text>
                  <Text style={styles.value}>{user.phoneNumber}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text>Không có thông tin người dùng</Text>
          </View>
        )}

        {/* Settings Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Cài đặt & Hỗ trợ</Text>
          {settingsMenu.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={22} color="#4CAF50" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info Section */}
        <View style={styles.appInfoSection}>
          <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoItem}>
              <Text style={styles.label}>Phiên bản</Text>
              <Text style={styles.value}>1.0.0</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.label}>Cập nhật lần cuối</Text>
              <Text style={styles.value}>06/11/2025</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 WDP Mobile. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;

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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  profileSection: {
    backgroundColor: "white",
    marginBottom: 15,
    paddingVertical: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  profileDetails: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  menuSection: {
    backgroundColor: "white",
    marginBottom: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f9f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  appInfoSection: {
    backgroundColor: "white",
    marginBottom: 15,
    paddingVertical: 10,
  },
  appInfoCard: {
    paddingHorizontal: 20,
  },
  appInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#f44336",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
