import { VehicleModel } from '../models/vehicle.model';
import { VehicleScheduler } from '../services';
import { Package } from '../models/package.model';
describe('VehicleModel', () => {
    const vehicleData = {
        id: 0,
        vehicleCount: 1,
        maxSpeed: 60,
        maxWeight: 1000,
        availableAt: 10,
    };

    const vehicle = new VehicleModel(vehicleData);

    test('should create a VehicleModel instance', () => {
        expect(vehicle).toBeInstanceOf(VehicleModel);
        expect(vehicle.vehicleCount).toBe(vehicleData.vehicleCount);
    });

    test('should calculate travel time correctly', () => {
        const distance = 120;
        expect(vehicle.travelTime(distance)).toBe(2); // 120 / 60 = 2 hours
    });

    test('should update vehicle availability', () => {
        vehicle.updateAvailability(15);
        expect(vehicle.availableAt).toBe(15);
    });
});


describe('VehicleScheduler Service', () => {
    const vehicleData = {
        id: 0,
        vehicleCount: 1,
        maxSpeed: 60,
        maxWeight: 1000,
        availableAt: 10,
    };

    const vehicle = new VehicleModel(vehicleData);

    const scheduler = new VehicleScheduler([vehicle]);

    const packageData = {
        id: 'pkg123',
        weight: 50,
        distance: 100,
        offerCode: 'DISCOUNT10',
        discount: 0,
        totalCost: 0,
        deliveryTime: null,
    };

    test('should schedule packages correctly', () => {
        const pkg = new Package(packageData);
        const scheduled = scheduler.schedulePackages([pkg]);

        expect(scheduled.length).toBe(1);
        expect(scheduled[0].getId()).toBe(pkg.getId());
        expect(scheduled[0].getDeliveryTime()).toBeGreaterThan(0);
    });

    test('should throw error if no packages provided for scheduling', () => {
        expect(() => scheduler.schedulePackages([])).toThrowError();
    });
});

