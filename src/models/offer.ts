export class Offer {
    constructor(
        public code: string,
        public discountPercent: number,
        public minWeight: number,
        public maxWeight: number,
        public minDistance: number,
        public maxDistance: number
    ) { }

    isApplicable(weight: number, distance: number): boolean {
        return (
            weight >= this.minWeight &&
            weight <= this.maxWeight &&
            distance >= this.minDistance &&
            distance <= this.maxDistance
        );
    }

    getDiscount(cost: number, weight: number, distance: number): number {
        if (this.isApplicable(weight, distance)) {
            return (this.discountPercent / 100) * cost;
        }
        return 0;
    }
}
