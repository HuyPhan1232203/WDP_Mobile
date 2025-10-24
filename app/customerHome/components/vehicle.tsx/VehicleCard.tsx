// components/home/VehicleCard.tsx
import { Vehicle } from "@/redux/types/vehicle";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

const getColorLabel = (color: string) => {
  const colorMap: { [key: string]: string } = {
    white: "Trắng",
    black: "Đen",
    gray: "Xám",
    red: "Đỏ",
    blue: "Xanh",
  };
  return colorMap[color] || color;
};

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.vehicleCard} onPress={onPress}>
      <View style={styles.vehicleHeader}>
        <Text style={styles.vehicleLicense}>{vehicle.license_plate}</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
      <Text style={styles.vehicleModel}>
        {vehicle.model_id.brand} {vehicle.model_id.model_name} (
        {vehicle.model_id.year})
      </Text>
      <View style={styles.vehicleDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="color-palette-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{getColorLabel(vehicle.color)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{vehicle.current_mileage} km</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="battery-half-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{vehicle.battery_health}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  vehicleLicense: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  vehicleModel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  vehicleDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
});
