// components/home/VehiclesSection.tsx
import { Vehicle } from "@/redux/types/vehicle";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VehicleCard } from "./VehicleCard";

interface VehiclesSectionProps {
  vehicles: Vehicle[];
  models: any[];
  onVehiclePress: (vehicle: Vehicle, modelName: string) => void;
  onAddVehicle: () => void;
}

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({
  vehicles,
  models,
  onVehiclePress,
  onAddVehicle,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="flash-sharp" size={20} color="#333" />
        <Text style={styles.sectionTitle}>Xe của bạn ({vehicles.length})</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Quản lý thông tin và lịch bảo dưỡng xe
      </Text>

      {vehicles.length > 0 ? (
        <View style={styles.vehicleList}>
          {vehicles.map((vehicle: Vehicle) => {
            const model = models.find((m) => m._id === vehicle.model_id._id);
            const modelName = model
              ? `${model.brand} ${model.model_name} (${model.year})`
              : "Unknown Model";

            return (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onPress={() => onVehiclePress(vehicle, modelName)}
              />
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="flash-sharp" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>Chưa có xe nào được đăng ký</Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={onAddVehicle}
          >
            <Ionicons name="add" size={16} color="#4CAF50" />
            <Text style={styles.emptyStateButtonText}>Thêm xe đầu tiên</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  vehicleList: {},
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 15,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  emptyStateButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
});
