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
  // useEffect(() => {
  //   dispatch(fetchUserProfile());
  // }, [dispatch]);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View />
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text>Đang tải...</Text>
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : user ? (
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Tên đăng nhập:</Text>
              <Text style={styles.value}>{user.username}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Họ tên:</Text>
              <Text style={styles.value}>{user.fullName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text style={styles.value}>{user.phoneNumber}</Text>
            </View>
          </View>
        ) : (
          <Text>Không có thông tin người dùng</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  profileSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
