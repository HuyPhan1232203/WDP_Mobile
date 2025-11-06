// app/(tabs)/index.tsx hoặc CustomerHome.tsx
import { getMyAppointments } from "@/redux/feature/appointmentSlice";
import {
  createVehicle,
  fetchAllModels,
  fetchUserVehicles,
} from "@/redux/feature/vehicleSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Vehicle } from "@/redux/types/vehicle";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { ActionButtons } from "./components/ActionButton";
import { AppointmentsSection } from "./components/appointment/AppointmentSection";
import { Header } from "./components/Header";
import { AddVehicleModal } from "./components/vehicle.tsx/AddVehicleModal";
import { VehiclesSection } from "./components/vehicle.tsx/VehicleSection";

const CustomerHome = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { models, vehicles, loading, error } = useAppSelector(
    (state) => state.vehicle
  );

  const {
    myAppointments,
    pagination,
    loading: appointmentLoading,
  } = useAppSelector((state) => state.appointment);

  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // Effects
  useEffect(() => {
    if (showAddVehicleModal && models.length === 0) {
      dispatch(fetchAllModels());
    }
  }, [showAddVehicleModal, dispatch]);

  useEffect(() => {
    dispatch(fetchUserVehicles());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMyAppointments({ page: 1, limit: 3 }));
  }, [dispatch]);

  // Handlers
  const handleAddVehicle = async (vehicleData: any) => {
    try {
      await dispatch(createVehicle(vehicleData)).unwrap();
      dispatch(fetchUserVehicles());
      setShowAddVehicleModal(false);

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Xe đã được thêm",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể thêm xe",
      });
    }
  };

  const handleVehiclePress = (vehicle: Vehicle, modelName: string) => {
    router.push({
      pathname: "/vehicle/vehicle",
      params: { vehicle: JSON.stringify(vehicle), modelName },
    });
  };

  const handleAppointmentPress = (appointmentId: string) => {
    router.push({
      pathname: "/appointment/appointment",
      params: { appointmentId },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Trang chủ" />

      <ScrollView style={styles.content}>
        <ActionButtons
          onAddVehicle={() => setShowAddVehicleModal(true)}
          onBookService={() => router.push("/service/service")}
          onReportIssue={() => {}}
          onSettings={() => {}}
        />

        <VehiclesSection
          vehicles={vehicles}
          models={models}
          onVehiclePress={handleVehiclePress}
          onAddVehicle={() => setShowAddVehicleModal(true)}
        />

        <AppointmentsSection
          appointments={myAppointments}
          loading={appointmentLoading}
          onAppointmentPress={handleAppointmentPress}
          onAddAppointment={() => router.push("/service/service")}
          onViewAll={() => router.push("/appointment/appointmentList")} // Add this
        />
      </ScrollView>

      <AddVehicleModal
        visible={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        models={models}
        loading={loading}
        error={error}
        onSubmit={handleAddVehicle}
      />
    </View>
  );
};

export default CustomerHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
