

import { CostCalculator, DeliveryCostCalculator } from '../services';
import { Package } from '../models';
import { COST_PER_KG, COST_PER_KM } from '../utils/config';
import { PackageData } from '../types';
import { OfferService, VehicleScheduler } from '../services';

describe('costCalculator Service', () => {
    const baseCost = 100;
    const calculator = new CostCalculator(baseCost);

    const packageData = {
        id: 'pkg123',
        weight: 50,
        distance: 100,
        offerCode: null,
    };

    const pkg = new Package(packageData);

    test('should calculate base cost correctly', () => {
        const expectedCost = baseCost + (pkg.getWeight() * COST_PER_KG) + (pkg.getDistance() * COST_PER_KM);
        expect(calculator.calculateBaseCost(pkg)).toBe(expectedCost);
    });
});

describe('DeliveryCostCalculator', () => {
    let calculator: DeliveryCostCalculator;
    let mockCostCalculator: jest.Mocked<CostCalculator>;
    let mockOfferService: jest.Mocked<OfferService>;
    let mockVehicleScheduler: jest.Mocked<VehicleScheduler>;

    beforeEach(() => {
        mockCostCalculator = {
            calculateBaseCost: jest.fn(),
        } as unknown as jest.Mocked<CostCalculator>;

        mockOfferService = {
            applyDiscount: jest.fn(),
        } as unknown as jest.Mocked<OfferService>;

        mockVehicleScheduler = {
            schedulePackages: jest.fn(),
        } as unknown as jest.Mocked<VehicleScheduler>;

        calculator = new DeliveryCostCalculator(
            mockCostCalculator,
            mockOfferService,
            mockVehicleScheduler
        );
    });

    const inputPackages: PackageData[] = [
        { id: 'PKG1', weight: 10, distance: 20, offerCode: 'OFR001' },
        { id: 'PKG2', weight: 5, distance: 30, offerCode: null },
    ];

    it('should calculate cost estimation correctly', () => {

        // Simulate base cost calculation and offer discounts
        mockCostCalculator.calculateBaseCost.mockReturnValue(300);
        mockOfferService.applyDiscount.mockImplementation((pkg) => {
            if (pkg.getId() === 'PKG1') {
                pkg.setDiscount(50);
                pkg.setTotalCost(200);
            } else {
                pkg.setDiscount(0);
                pkg.setTotalCost(250);
            }
            return pkg;
        });

        const result = calculator.getCostEstimation(inputPackages);

        expect(result).toEqual([
            { id: 'PKG1', discount: 50, totalCost: 200 },
            { id: 'PKG2', discount: 0, totalCost: 250 },
        ]);
    });

    it('should calculate cost and time estimation correctly', () => {
        const pkg1 = new Package(inputPackages[0]);
        const pkg2 = new Package(inputPackages[1]);

        pkg1.setDiscount(50);
        pkg1.setTotalCost(200);
        pkg1.setDeliveryTime(3.567);

        pkg2.setDiscount(0);
        pkg2.setTotalCost(250);
        pkg2.setDeliveryTime(5);

        mockVehicleScheduler.schedulePackages.mockReturnValue([pkg1, pkg2]);

        const result = calculator.getCostAndTimeEstimation(inputPackages);

        expect(result).toEqual([
            { id: 'PKG1', discount: 50, totalCost: 200, deliveryTime: 3.56 },
            { id: 'PKG2', discount: 0, totalCost: 250, deliveryTime: 5.0 },
        ]);
    });
});
