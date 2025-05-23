import { IVehicle, VehicleData } from '../types';

// The VehicleModel represents a vehicle's data and behavior.
export class VehicleModel implements IVehicle {
    id: number;
    vehicleCount: number;
    maxSpeed: number;
    maxWeight: number;
    availableAt: number;

    constructor(vehicle: VehicleData) {
        this.id = vehicle.id;
        this.vehicleCount = vehicle.vehicleCount;
        this.maxSpeed = vehicle.maxSpeed;
        this.maxWeight = vehicle.maxWeight;
        this.availableAt = vehicle.availableAt;
    }

    // Calculate the travel time for a given distance based on the vehicle's max speed.
    travelTime(distance: number): number {
        return distance / this.maxSpeed;
    }

    // Update the availability time of the vehicle.
    updateAvailability(newAvailableAt: number): void {
        this.availableAt = newAvailableAt;
    }
}
