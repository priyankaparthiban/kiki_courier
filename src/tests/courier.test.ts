import { CourierService } from '../services/courierService';
import { Package } from '../models/package';

describe('CourierService', () => {
    it('should estimate delivery time based on distance and speed', () => {
        const courierService = new CourierService();
        const pkg = new Package('PKG1', 50, 140);
        const deliveryTime = courierService.estimateDeliveryTime(pkg);

        expect(deliveryTime).toBeCloseTo(2, 2);
    });

    it('should return correct max load from env', () => {
        const courierService = new CourierService();
        expect(courierService.getMaxLoad()).toBe(200);
    });
});
