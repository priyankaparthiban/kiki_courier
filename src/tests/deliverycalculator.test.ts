import { CostCalculator, DeliveryCostCalculator } from '../services';
import { Package } from '../models';
import { COST_PER_KG, COST_PER_KM } from '../utils/config';
import { PackageData } from '../types';
import { OfferService, VehicleScheduler } from '../services';
import { InvalidPackageDetailsException } from '../exceptions';
jest.mock('../models');

describe('costCalculator Service', () => {
    const baseCost = 100;
    const calculator = new CostCalculator(baseCost);

    const packageData = {
        id: 'pkg123',
        weight: 50,
        distance: 100,
        offerCode: null,
        discount: 0,
        totalCost: 0,
        deliveryTime: null,
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
        { id: 'PKG1', weight: 10, distance: 20, offerCode: 'OFRR0fgg01' },
        { id: 'PKG2', weight: 5, distance: 30, offerCode: null },
    ];

    const createMockPackage = (id: string, discount = 0, totalCost = 0, deliveryTime?: number) =>
        ({
            getId: () => id,
            getDiscount: () => discount,
            getTotalCost: () => totalCost,
            getDeliveryTime: () => deliveryTime,
        }) as any;

    it('should calculate cost estimation correctly', () => {
        (Package as jest.Mock).mockImplementationOnce(() => createMockPackage('PKG1', 50, 200))
            .mockImplementationOnce(() => createMockPackage('PKG2', 0, 250));

        mockCostCalculator.calculateBaseCost.mockReturnValue(300);

        const result = calculator.getCostEstimation(inputPackages);

        expect(result).toEqual([
            { id: 'PKG1', discount: 50, totalCost: 200 },
            { id: 'PKG2', discount: 0, totalCost: 250 },
        ]);
    });

    it('should calculate cost and time estimation correctly', () => {
        const pkg1 = createMockPackage('PKG1', 50, 200, 3.567);
        const pkg2 = createMockPackage('PKG2', 0, 250, 5);

        (Package as jest.Mock).mockImplementationOnce(() => pkg1)
            .mockImplementationOnce(() => pkg2);

        mockVehicleScheduler.schedulePackages.mockReturnValue([pkg1, pkg2]);

        const result = calculator.getCostAndTimeEstimation(inputPackages, [
            { id: 0, vehicleCount: 1, maxSpeed: 70, maxWeight: 200, availableAt: 0 },
        ]);

        expect(result).toEqual([
            { id: 'PKG1', discount: 50, totalCost: 200, deliveryTime: 3.56 },
            { id: 'PKG2', discount: 0, totalCost: 250, deliveryTime: 5.0 },
        ]);
    });

    it('should throw error if invalid package input throws inside constructor', () => {
        (Package as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Invalid weight');
        });

        expect(() => calculator.getCostEstimation([{ id: 'PKG_BAD', weight: -1, distance: 10, offerCode: null }]))
            .toThrowError(InvalidPackageDetailsException);
    });

});
