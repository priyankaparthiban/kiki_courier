import { VehicleAvailabilityManager, PackageSelector } from '..';
import {
    NoPackagesToScheduleException
} from '../../exceptions';
import { IVehicle, IPackage } from '../../types';

export class VehicleScheduler {
    private vehicleAvailabilityManager: VehicleAvailabilityManager;
    private packageSelector: PackageSelector;

    constructor(vehicles: IVehicle[]) {
        this.vehicleAvailabilityManager = new VehicleAvailabilityManager(vehicles);
        this.packageSelector = new PackageSelector();
    }

    // Method to schedule packages
    schedulePackages(packages: IPackage[]): IPackage[] {
        if (!packages.length) {
            throw new NoPackagesToScheduleException('No packages provided for scheduling.');
        }

        const scheduled: IPackage[] = [];
        let pending = [...packages];

        while (pending.length) {
            // Get the next available vehicle (as IVehicle)
            const vehicle = this.vehicleAvailabilityManager.getNextAvailableVehicle();

            // Select the best combination of packages under vehicle's maxWeight
            const { selected, remaining } = this.packageSelector.selectPackages(pending, vehicle.maxWeight);
            if (!selected.length) break;

            const maxDistance = Math.max(...selected.map(p => p.getDistance()));
            const deliveryStart = vehicle.availableAt;

            selected.forEach(pkg => {
                // Calculate delivery time for each package
                if (vehicle.travelTime) {
                    const deliveryTime = deliveryStart + vehicle.travelTime(pkg.getDistance());
                    pkg.setDeliveryTime(Math.floor(deliveryTime * 100) / 100);
                    scheduled.push(pkg);
                }
            });

            const oneWayTime = vehicle.travelTime ? vehicle.travelTime(maxDistance) : 0;
            const returnTime = deliveryStart + 2 * (Math.floor(oneWayTime * 100) / 100);

            // Update vehicle availability
            this.vehicleAvailabilityManager.updateVehicleAvailability(vehicle, Math.floor(returnTime * 100) / 100);

            pending = remaining;
        }

        // Sort packages by ID for consistent output
        scheduled.sort((a, b) => a.getId().localeCompare(b.getId()));

        return scheduled;
    }
}
