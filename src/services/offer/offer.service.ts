import { Offer, IPackage } from '../../types';
import { getOffersFromEnv } from '../../utils';
import { OfferModel } from '../../models';
import { InvalidOfferConfigException } from '../../exceptions';

export class OfferService {
    private offers: OfferModel[];

    constructor() {
        const rawOffers: Offer[] = getOffersFromEnv();

        try {
            this.offers = rawOffers.map(o => new OfferModel(o));
        } catch (err: any) {
            throw new InvalidOfferConfigException(err.message);
        }
    }
    // calculate and return discount if discount is applicable for the weight and distance
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
            // Check if the offer code is valid and applicable
            discount = this.getDiscount(offerCode, cost, pkg.getWeight(), pkg.getDistance());
        }

        // Set the discount and total cost on the package
        pkg.setDiscount(discount);
        pkg.setTotalCost(cost - discount);
    }

}
