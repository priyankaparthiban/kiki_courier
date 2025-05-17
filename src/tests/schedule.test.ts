import { Scheduler } from '../services/vechicleScheduleService';
import { Vehicle } from '../models/vehicle';
import { Package } from '../models/package';

describe('Scheduler', () => {
    it('should schedule packages to vehicles and assign correct delivery times', () => {
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

        for (const pkg of result) {
            expect(pkg.deliveryTime).toBeGreaterThan(0);
        }

        // check one specific package's delivery time
        const pkg1 = result.find(p => p.id === 'PKG1');
        expect(pkg1).toBeDefined();
        if (pkg1) {
            const expectedTime = 30 / 70; // time = distance / speed
            expect(pkg1.deliveryTime).toBeCloseTo(expectedTime, 2); // precision up to 2 decimal places
        }
    });
});
