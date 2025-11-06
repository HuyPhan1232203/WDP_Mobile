import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/use-color-scheme";
import Toast from "react-native-toast-message";
import { store } from "../redux/store";

// 🔥 Import TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 🔥 Tạo QueryClient (ngoài component để không bị re-create)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Cấu hình navigation để không hiển thị tabs
export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      {/* 🔥 Thêm QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1 }}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
            <Toast />
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaView>
      </QueryClientProvider>
    </Provider>
  );
}
