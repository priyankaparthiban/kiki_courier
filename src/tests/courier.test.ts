import { CourierService } from '../services/courierService';
import { PackageInput } from '../types/index';

describe('CourierService', () => {
    it('should estimate delivery time based on distance and speed', () => {
        const courierService = new CourierService();

        const pkg: PackageInput = {
            id: 'PKG1',
            weight: 50,
            distance: 140,
            offerCode: null,
            discount: 0,
            totalCost: 0,
            deliveryTime: null
        };

        const deliveryTime = courierService.estimateDeliveryTime(pkg);
        expect(deliveryTime).toBeCloseTo(2, 2);
    });

    it('should return correct max load from env', () => {
        const courierService = new CourierService();
        expect(courierService.getMaxLoad()).toBe(200);
    });
});
