import api from "@/config/axios";
import { auth } from "@/config/firebase";
import { fetchUserProfile } from "@/redux/feature/userSlice";
import { AppDispatch } from "@/redux/store";
import { tokenStorage } from "@/utils/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Link, useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const handleEmailLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập tên đăng nhập và mật khẩu",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("users/login", {
        username: username,
        password,
      });
      const { accessToken } = response.data;
      await tokenStorage.saveToken(accessToken);

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công",
        text2: `Chào mừng ${username}!`,
      });
      await dispatch(fetchUserProfile());
      console.log(response);
      if (response.data.role === "customer") {
        router.push("/customerHome/customerHome");
        return;
      } else if (response.data.role === "technician") {
        router.push(`/technician`);
        return;
      }
      router.push("/customerHome/customerHome");
      // router.push("/technician/schedule/list");
    } catch (error: any) {
      console.error("Login Error:", error);
      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2:
          error.response?.data?.message || error.message || "Vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "871536505605-7vpli169042ggstr7ejij0ql62qdmic7.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      const { idToken } = userInfo.data;

      if (!idToken) {
        throw new Error("No ID token received from Google Sign-In");
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;

      const firebaseIdToken = await firebaseUser.getIdToken();

      // DEBUG: Log token details
      console.log("🔑 Firebase User ID:", firebaseUser.uid);
      console.log("📧 Email:", firebaseUser.email);
      console.log(
        "🎫 Token (first 50 chars):",
        firebaseIdToken.substring(0, 50)
      );
      console.log("🎫 Token length:", firebaseIdToken.length);

      // Decode token to see claims (for debugging only - not secure for production)
      try {
        const tokenParts = firebaseIdToken.split(".");
        if (tokenParts.length === 3) {
          // Use base64url decoding for JWT
          const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
          const paddedBase64 =
            base64 + "=".repeat((4 - (base64.length % 4)) % 4);
          const payload = JSON.parse(atob(paddedBase64));
          console.log("📦 Token payload:", {
            aud: payload.aud,
            iss: payload.iss,
            exp: new Date(payload.exp * 1000),
            iat: new Date(payload.iat * 1000),
          });
        }
      } catch (decodeError) {
        console.warn("⚠️ Could not decode token payload:", decodeError);
      }

      const backendResponse = await api.post("users/loginfirebase", {
        idToken: firebaseIdToken,
      });

      console.log("✅ Backend response:", backendResponse.data);

      const { accessToken } = backendResponse.data;
      await tokenStorage.saveToken(accessToken);

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công",
        text2: `Chào mừng ${firebaseUser.displayName || firebaseUser.email}!`,
      });

      await dispatch(fetchUserProfile());
      router.push("/customerHome/customerHome");
    } catch (error: any) {
      console.error("Google Login Error:", error);

      // Enhanced error logging for 401
      if (error.response?.status === 401) {
        console.error("❌ 401 Unauthorized Details:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });
      }

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          type: "info",
          text1: "Đã hủy đăng nhập",
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: "info",
          text1: "Đang xử lý...",
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Google Play Services không khả dụng",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Đăng nhập Google thất bại",
          text2:
            error.response?.data?.message ||
            error.message ||
            "Vui lòng thử lại",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/hero-ev-service.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#333" />
            <Text style={styles.backButtonText}>Trang chủ</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="car-outline" size={32} color="#4CAF50" />
            </View>
          </View>

          <View style={styles.loginCard}>
            <Text style={styles.title}>Đăng nhập bằng email</Text>
            <Text style={styles.subtitle}>
              Cung cấp dịch vụ chăm sóc xe điện chuyên nghiệp với sự tin cậy và
              độ tin cậy mà bạn xứng đáng.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên đăng nhập</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Tên đăng nhập"
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#999"
                  />
                </Pressable>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Chưa có tài khoản? </Text>
              <Link href="/login/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <Text style={styles.copyright}>
              © 2024 EV Care Connect. Tất cả quyền được bảo lưu.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: "#4CAF50",
    fontSize: 14,
    textAlign: "left",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  copyright: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
});
