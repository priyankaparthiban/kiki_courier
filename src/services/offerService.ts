import { Offer } from '../types/index';
import { getOffersFromEnv } from '../utils/config';

export class OfferService {
    private offers: Offer[];

    constructor() {
        this.offers = getOffersFromEnv();
    }

    public getDiscount(
        offerCode: string,
        cost: number,
        weight: number,
        distance: number
    ): number {
        const offer = this.offers.find((o) => o.code === offerCode);
        if (
            offer &&
            weight >= offer.minWeight &&
            weight <= offer.maxWeight &&
            distance >= offer.minDistance &&
            distance <= offer.maxDistance
        ) {
            return (cost * offer.discountPercent) / 100;
        }
        return 0;
    }
}
