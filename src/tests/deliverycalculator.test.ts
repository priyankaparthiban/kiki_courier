import { DeliveryCostCalculator } from '../services/deliveryCalculator';
import { Package } from '../models/package';
import { BASE_DELIVERY_COST, COST_PER_KG, COST_PER_KM } from '../utils/config';

describe('DeliveryCostCalculator', () => {
    it('calculates delivery cost correctly', () => {
        const baseCost = BASE_DELIVERY_COST;
        const calculator = new DeliveryCostCalculator(baseCost);

        const pkg = new Package('PKG1', 5, 5);
        const expectedCost = baseCost + pkg.weight * COST_PER_KG + pkg.distance * COST_PER_KM;

        expect(calculator.calculateDeliveryCost(pkg)).toBe(expectedCost);
    });
});
