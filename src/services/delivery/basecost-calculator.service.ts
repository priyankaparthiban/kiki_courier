import { IPackage } from '../../types';
import { COST_PER_KG, COST_PER_KM } from '../../utils';


export class CostCalculator {
    private baseDeliveryCost: number;
    private readonly costPerKg = COST_PER_KG;
    private readonly costPerKm = COST_PER_KM;

    constructor(baseDeliveryCost: number) {
        this.baseDeliveryCost = baseDeliveryCost;
    }

    calculateBaseCost(pkg: IPackage): number {
        return this.baseDeliveryCost + pkg.getWeight() * this.costPerKg + pkg.getDistance() * this.costPerKm;
    }
}