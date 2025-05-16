
import { Package } from '../models/package';
import { COST_PER_KG, COST_PER_KM, BASE_DELIVERY_COST } from '../utils/config';
export class DeliveryCostCalculator {
    private baseDeliveryCost: number = BASE_DELIVERY_COST;
    private costPerKg: number = COST_PER_KG;
    private costPerKm: number = COST_PER_KM;

    constructor(baseDeliveryCost: number) {
        this.baseDeliveryCost = baseDeliveryCost;
    }

    calculateDeliveryCost(pkg: Package): number {
        return (
            this.baseDeliveryCost +
            pkg.weight * this.costPerKg +
            pkg.distance * this.costPerKm
        );
    }
}
