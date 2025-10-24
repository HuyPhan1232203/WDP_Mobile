import { createVehicle, fetchAllModels } from "@/redux/feature/vehicleSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select"; // Install if needed

const CreateVehicleForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { models, loading, error } = useAppSelector((state) => state.vehicle);
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  useEffect(() => {
    dispatch(fetchAllModels()); // Fetch models when component mounts
  }, [dispatch]);

  const handleCreateVehicle = () => {
    // Assuming other fields are collected
    dispatch(
      createVehicle({
        license_plate: "79A1-56789",
        color: "Xanh dương",
        purchase_date: "2024-12-01",
        current_mileage: 15000,
        battery_health: 98,
        last_service_mileage: 10000,
        model_id: selectedModelId,
      })
    );
  };

  const modelItems = models.map((model) => ({
    label: `${model.brand} ${model.model_name}`,
    value: model._id, // Assuming VehicleModel has _id
  }));

  return (
    <View>
      {loading && <Text>Loading models...</Text>}
      {error && <Text>Error: {error}</Text>}
      <RNPickerSelect
        onValueChange={(value) => setSelectedModelId(value)}
        items={modelItems}
        placeholder={{ label: "Select a model", value: null }}
      />
      <Button title="Create Vehicle" onPress={handleCreateVehicle} />
    </View>
  );
};

export default CreateVehicleForm;
