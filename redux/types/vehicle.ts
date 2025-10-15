export interface VehicleModel {
  _id: string;
  brand: string;
  model_name: string;
  year: number;
  battery_type: string;
  maintenanceIntervalKm: number;
  maintenanceIntervalMonths: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Vehicle {
  _id: string;
  license_plate: string;
  color: string;
  purchase_date: string;
  current_mileage: number;
  battery_health: number;
  last_service_mileage: number;
  model_id: VehicleModel;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateModelRequest {
  brand: string;
  model_name: string;
  year: number;
  battery_type: string;
  maintenanceIntervalKm: number;
  maintenanceIntervalMonths: number;
}

export interface CreateVehicleRequest {
  license_plate: string;
  color: string;
  purchase_date: string;
  current_mileage: number;
  battery_health: number;
  last_service_mileage: number;
  model_id: string;
}
