import { Offer, IOffer } from '../types';

// The OfferModel encapsulates the logic for applying and validating offers.
export class OfferModel implements Offer, IOffer {
    code: string;
    discountPercent: number;
    minWeight: number;
    maxWeight: number;
    minDistance: number;
    maxDistance: number;

    constructor(offer: Offer) {
        this.code = offer.code;
        this.discountPercent = offer.discountPercent;
        this.minWeight = offer.minWeight;
        this.maxWeight = offer.maxWeight;
        this.minDistance = offer.minDistance;
        this.maxDistance = offer.maxDistance;
    }

    // Check if the offer is applicable based on weight and distance.
    isApplicable(weight: number, distance: number): boolean {
        return weight >= this.minWeight &&
            weight <= this.maxWeight &&
            distance >= this.minDistance &&
            distance <= this.maxDistance;
    }

    // Calculate the discount based on the given cost.
    calculateDiscount(cost: number): number {
        return (cost * this.discountPercent) / 100;
    }
}
