import { IVehicle } from '../../types';
import { NoVehiclesAvailableException } from '../../exceptions';

export class VehicleAvailabilityManager {
    private vehicles: IVehicle[];

    constructor(vehicles: IVehicle[]) {
        if (!vehicles.length) {
            throw new NoVehiclesAvailableException('At least one vehicle must be provided.');
        }
        this.vehicles = vehicles;
    }

    // Return type should be IVehicle to keep it loosely coupled
    getNextAvailableVehicle(): IVehicle {
        return this.vehicles.reduce((earliest, v) =>
            v.availableAt < earliest.availableAt ? v : earliest
        );
    }

    // vehicle param should be IVehicle — no need to tie to VehicleModel
    updateVehicleAvailability(vehicle: IVehicle, newAvailableAt: number): void {
        vehicle.availableAt = newAvailableAt;
    }
}
