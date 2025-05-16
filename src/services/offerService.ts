import { Offer } from '../models/offer';

export class OfferService {
    private offers: Offer[] = [];

    constructor() {
        this.loadOffersFromEnv();
    }

    private loadOffersFromEnv() {
        const offerCodes = process.env.OFFERS?.split(',') || [];
        for (const code of offerCodes) {
            const discountPercent = Number(process.env[`${code}_DISCOUNT_PERCENT`]);
            const minWeight = Number(process.env[`${code}_MIN_WEIGHT`]);
            const maxWeight = Number(process.env[`${code}_MAX_WEIGHT`]);
            const minDistance = Number(process.env[`${code}_MIN_DISTANCE`]);
            const maxDistance = Number(process.env[`${code}_MAX_DISTANCE`]);

            if (
                !isNaN(discountPercent) &&
                !isNaN(minWeight) &&
                !isNaN(maxWeight) &&
                !isNaN(minDistance) &&
                !isNaN(maxDistance)
            ) {
                this.offers.push(
                    new Offer(code, discountPercent, minWeight, maxWeight, minDistance, maxDistance)
                );
            }
        }
    }

    getDiscount(code: string, cost: number, weight: number, distance: number): number {
        const offer = this.offers.find(o => o.code === code);
        return offer ? offer.getDiscount(cost, weight, distance) : 0;
    }
}
