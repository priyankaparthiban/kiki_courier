import { Package } from '../models/package';
import dotenv from 'dotenv';

dotenv.config();

export class CourierService {
    private maxSpeed: number;
    private maxLoad: number;

    constructor() {
        this.maxSpeed = parseFloat(process.env.VEHICLE_MAX_SPEED || '70');
        this.maxLoad = parseFloat(process.env.VEHICLE_MAX_LOAD || '200');
    }

    estimateDeliveryTime(pkg: Package): number {
        const time = pkg.distance / this.maxSpeed;
        return parseFloat(time.toFixed(2));
    }

    getMaxLoad(): number {
        return this.maxLoad;
    }
}
