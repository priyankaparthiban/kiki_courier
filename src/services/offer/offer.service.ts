import { Offer, IPackage, IOffer } from '../../types';
import { getOffersFromEnv } from '../../utils';
import { OfferModel } from '../../models';
import { InvalidOfferConfigException } from '../../exceptions';

export class OfferService {
    private offers: IOffer[];

    constructor(offers?: IOffer[]) {
        const rawOffers: Offer[] = getOffersFromEnv();

        try {
            this.offers = rawOffers.map(o => new OfferModel(o));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid offer configuration';
            throw new InvalidOfferConfigException(message);
        }
    }

    // Calculate and return discount if applicable for the weight and distance
    public getDiscount(
        offerCode: string,
        cost: number,
        weight: number,
        distance: number
    ): number {
        const offer = this.offers.find(o => o.code === offerCode);
        if (offer && offer.isApplicable(weight, distance)) {
            return offer.calculateDiscount(cost);
        }

        return 0;
    }

    public applyDiscount(pkg: IPackage, cost: number): void {
        const offerCode = pkg.getOfferCode();
        let discount = 0;

        if (offerCode) {
            discount = this.getDiscount(
                offerCode,
                cost,
                pkg.getWeight(),
                pkg.getDistance()
            );
        }

        pkg.setDiscount(discount);
        pkg.setTotalCost(cost - discount);
    }
}
