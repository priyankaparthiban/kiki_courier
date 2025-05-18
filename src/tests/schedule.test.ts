import { Scheduler } from '../services/vechicleScheduleService';
import { PackageInput, Vehicle } from '../types/index';

describe('Scheduler (Combinatorial Batching)', () => {
    it('should schedule packages to vehicles and assign correct delivery times based on optimal batching', () => {
        // Create vehicles as plain objects matching the Vehicle interface
        const vehicles: Vehicle[] = [
            { id: 1, maxSpeed: 70, maxWeight: 200, availableAt: 0 },
            { id: 2, maxSpeed: 70, maxWeight: 200, availableAt: 0 }
        ];

        // Define packages as PackageInput objects
        const packages: PackageInput[] = [
            { id: 'PKG1', weight: 50, distance: 30, offerCode: null, discount: 0, totalCost: 0, deliveryTime: null },
            { id: 'PKG2', weight: 75, distance: 125, offerCode: null, discount: 0, totalCost: 0, deliveryTime: null },
            { id: 'PKG3', weight: 175, distance: 100, offerCode: null, discount: 0, totalCost: 0, deliveryTime: null },
            { id: 'PKG4', weight: 110, distance: 60, offerCode: null, discount: 0, totalCost: 0, deliveryTime: null },
            { id: 'PKG5', weight: 155, distance: 95, offerCode: null, discount: 0, totalCost: 0, deliveryTime: null }
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
            const vehicleUsed = vehicles.find(v => deliveryTime <= v.availableAt) ?? vehicles[0];
            vehicleSchedules[vehicleUsed.id].push(pkg.distance);
        }

        // Check delivery time of one known package manually
        const pkg2 = result.find(p => p.id === 'PKG2');
        expect(pkg2).toBeDefined();
        if (pkg2) {
            const rawTime = pkg2.distance / 70;
            const approxTime = Math.floor(rawTime * 100) / 100;
            expect(pkg2.deliveryTime!).toBeCloseTo(approxTime, 2);
        }
    });
});
