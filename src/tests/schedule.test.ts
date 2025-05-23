import { VehicleScheduler } from '../services/vehicle/vehicle-scheduler.service';
import { VehicleModel } from '../models/vehicle.model';
import { Package } from '../models/package.model';
import { PackageData } from '../types/index';

describe('Scheduler (Combinatorial Batching)', () => {
    it('should schedule packages to vehicles and assign correct delivery times based on optimal batching', () => {
        // Create vehicles using VehicleModel
        const vehicles: VehicleModel[] = [
            new VehicleModel({ id: 0, vehicleCount: 1, maxSpeed: 70, maxWeight: 200, availableAt: 0 }),
            new VehicleModel({ id: 0, vehicleCount: 2, maxSpeed: 70, maxWeight: 200, availableAt: 0 })
        ];

        // Construct PackageData instances to create Package models
        const packageData: PackageData[] = [
            { id: 'PKG1', weight: 50, distance: 30, offerCode: null },
            { id: 'PKG2', weight: 75, distance: 125, offerCode: null },
            { id: 'PKG3', weight: 175, distance: 100, offerCode: null },
            { id: 'PKG4', weight: 110, distance: 60, offerCode: null },
            { id: 'PKG5', weight: 155, distance: 95, offerCode: null }
        ];

        // Create actual Package model instances from PackageData
        const packages: Package[] = packageData.map(data => new Package(data));

        // Instantiate the VehicleScheduler
        const scheduler = new VehicleScheduler(vehicles);

        // Run the package scheduling process
        const result = scheduler.schedulePackages(packages);

        // Assert that all packages have been scheduled
        expect(result.length).toBe(5);

        // Each package must have a valid delivery time
        result.forEach(pkg => {
            expect(pkg.getDeliveryTime()).toBeGreaterThan(0);
        });

        // Validate a known package's delivery time
        const pkg2 = result.find(p => p.getId() === 'PKG2');
        expect(pkg2).toBeDefined();

        if (pkg2) {
            // Delivery time calculation (considering the vehicle speed)
            const expectedTime = pkg2.getDistance() / 70;  // time = distance / speed
            const approxTime = Math.floor(expectedTime * 100) / 100; // Round to two decimal places
            expect(pkg2.getDeliveryTime()!).toBeCloseTo(approxTime, 2);
        }
    });
});
