import { OfferModel, Package } from '../models';
import { OfferService } from '../services';
describe('OfferModel', () => {
    const offerData = {
        code: 'DISCOUNT10',
        discountPercent: 10,
        minWeight: 1,
        maxWeight: 100,
        minDistance: 10,
        maxDistance: 500,
    };
    const offer = new OfferModel(offerData);

    test('should create an OfferModel instance', () => {
        expect(offer).toBeInstanceOf(OfferModel);
        expect(offer.code).toBe(offerData.code);
        expect(offer.discountPercent).toBe(offerData.discountPercent);
    });

    test('should return true if offer is applicable', () => {
        expect(offer.isApplicable(50, 100)).toBe(true);
    });

    test('should return false if offer is not applicable due to weight', () => {
        expect(offer.isApplicable(150, 100)).toBe(false);
    });

    test('should return the correct discount', () => {
        const cost = 100;
        expect(offer.calculateDiscount(cost)).toBe(10);
    });
});





describe('OfferService', () => {
    const offerService = new OfferService();

    test('should return the correct discount for a valid offer', () => {
        const pkgData = {
            id: 'pkg123',
            weight: 80,
            distance: 100,
            offerCode: 'OFR001',
            discount: 0,
            totalCost: 0,
            deliveryTime: null,
        };

        const pkg = new Package(pkgData);
        const baseCost = 200;

        // Assuming getDiscount is correctly set up
        const discount = offerService.getDiscount(pkg.getOfferCode(), baseCost, pkg.getWeight(), pkg.getDistance());
        expect(discount).toBe(20); // 10% of 200 is 20

        offerService.applyDiscount(pkg, baseCost);
        expect(pkg.getDiscount()).toBe(20);
        expect(pkg.getTotalCost()).toBe(180); // Base cost 200 - discount 20 = 180
    });
});

