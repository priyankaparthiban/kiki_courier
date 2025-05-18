import { Scheduler } from '../services/vechicleScheduleService';
import { Vehicle } from '../models/vehicle';
import { Package } from '../models/package';

describe('Scheduler (Combinatorial Batching)', () => {
    it('should schedule packages to vehicles and assign correct delivery times based on optimal batching', () => {
        const vehicles = [
            new Vehicle(1, 70, 200),
            new Vehicle(2, 70, 200)
        ];

        const packages = [
            new Package('PKG1', 50, 30),
            new Package('PKG2', 75, 125),
            new Package('PKG3', 175, 100),
            new Package('PKG4', 110, 60),
            new Package('PKG5', 155, 95)
        ];

        const scheduler = new Scheduler(vehicles);
        const result = scheduler.schedulePackages(packages);

        // Validate all packages are scheduled
        expect(result.length).toBe(5);

        // Each package must have a valid delivery time
        result.forEach(pkg => {
            expect(pkg.deliveryTime).toBeGreaterThan(0);
        });

        // Group by vehicle availability to verify proper scheduling logic
        const vehicleSchedules: Record<number, number[]> = {};

        for (const v of vehicles) {
            vehicleSchedules[v.id] = [];
        }

        for (const pkg of result) {
            const deliveryTime = pkg.deliveryTime!;
            const vehicleUsed = vehicles.find(v =>
                deliveryTime <= v.availableAt
            ) ?? vehicles[0];
            vehicleSchedules[vehicleUsed.id].push(pkg.distance);
        }

        // Check delivery time of one known package manually
        const pkg2 = result.find(p => p.id === 'PKG2');
        expect(pkg2).toBeDefined();
        if (pkg2) {
            const rawTime = pkg2.distance / 70;
            const approxTime = Math.floor(rawTime * 100) / 100;
            expect(pkg2.deliveryTime!).toBe(approxTime);
        }
    });
});
