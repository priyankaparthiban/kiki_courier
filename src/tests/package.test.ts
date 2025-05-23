import { Package } from '../models';

describe('Package Model', () => {
    const packageData = {
        id: 'pkg123',
        weight: 50,
        distance: 200,
        offerCode: 'OFR001',
        discount: 0,
        totalCost: 0,
        deliveryTime: null,
    };

    const pkg = new Package(packageData);

    test('should create a Package instance', () => {
        expect(pkg).toBeInstanceOf(Package);
        expect(pkg.getId()).toBe(packageData.id);
    });

    test('should set discount correctly', () => {
        pkg.setDiscount(10);
        expect(pkg.getDiscount()).toBe(10);
    });

    test('should set total cost correctly', () => {
        pkg.setTotalCost(90);
        expect(pkg.getTotalCost()).toBe(90);
    });

    test('should set and get delivery time correctly', () => {
        pkg.setDeliveryTime(5);
        expect(pkg.getDeliveryTime()).toBe(5);
    });
});
