import { DeliveryCostCalculator } from '../services/deliveryCalculator';
import { PackageInput } from '../types/index';
import { COST_PER_KG, COST_PER_KM } from '../utils/config';

describe('DeliveryCostCalculator', () => {
    it('calculates delivery cost correctly', () => {
        const baseCost = 100;
        const calculator = new DeliveryCostCalculator(baseCost);

        const pkg: PackageInput = {
            id: 'PKG1',
            weight: 5,
            distance: 5,
            offerCode: null,
            discount: 0,
            totalCost: 0,
            deliveryTime: null,
        };
        const expectedCost = baseCost + pkg.weight * COST_PER_KG + pkg.distance * COST_PER_KM;

        expect(calculator.calculateDeliveryCost(pkg)).toBe(expectedCost);
    });
});
