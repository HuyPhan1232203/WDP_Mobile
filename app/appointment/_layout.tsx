import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="appointment" options={{ headerShown: false }} />
      <Stack.Screen name="appointmentList" options={{ headerShown: false }} />
    </Stack>
  );
}
