import { OfferService } from '../services/offerService';

describe('OfferService - Environment Based Offers', () => {
    beforeEach(() => {
        process.env.OFFERS = 'OFR001,OFR002';

        process.env.OFR001_DISCOUNT_PERCENT = '10';
        process.env.OFR001_MIN_WEIGHT = '70';
        process.env.OFR001_MAX_WEIGHT = '200';
        process.env.OFR001_MIN_DISTANCE = '0';
        process.env.OFR001_MAX_DISTANCE = '199';

        process.env.OFR002_DISCOUNT_PERCENT = '7';
        process.env.OFR002_MIN_WEIGHT = '100';
        process.env.OFR002_MAX_WEIGHT = '250';
        process.env.OFR002_MIN_DISTANCE = '50';
        process.env.OFR002_MAX_DISTANCE = '150';
    });

    it('should apply correct discount for OFR001 when applicable', () => {
        const offerService = new OfferService();
        const baseCost = 300;
        const weight = 100;
        const distance = 50;

        const discount = offerService.getDiscount('OFR001', baseCost, weight, distance);
        expect(discount).toBe(30);
    });

    it('should apply 0 discount for OFR001 when not applicable', () => {
        const offerService = new OfferService();
        const baseCost = 300;
        const weight = 50;
        const distance = 50;

        const discount = offerService.getDiscount('OFR001', baseCost, weight, distance);
        expect(discount).toBe(0);
    });

    it('should apply correct discount for OFR002 when applicable', () => {
        const offerService = new OfferService();
        const baseCost = 200;
        const weight = 150;
        const distance = 100;

        const discount = offerService.getDiscount('OFR002', baseCost, weight, distance);
        expect(discount).toBeCloseTo(14, 2);
    });

    it('should return 0 discount if offer code does not exist', () => {
        const offerService = new OfferService();
        const discount = offerService.getDiscount('INVALID', 300, 100, 50);
        expect(discount).toBe(0);
    });
});
