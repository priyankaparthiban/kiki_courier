
import { PackageInput } from '../types/index';
import { COST_PER_KG, COST_PER_KM } from '../utils/config';
export class DeliveryCostCalculator {
    private baseDeliveryCost: number;
    private costPerKg: number = COST_PER_KG;
    private costPerKm: number = COST_PER_KM;

    constructor(baseDeliveryCost: number) {
        this.baseDeliveryCost = baseDeliveryCost;
    }

    calculateDeliveryCost(pkg: PackageInput): number {
        return (
            this.baseDeliveryCost +
            pkg.weight * this.costPerKg +
            pkg.distance * this.costPerKm
        );
    }
}
