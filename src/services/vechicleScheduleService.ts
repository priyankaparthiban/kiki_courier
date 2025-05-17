import { Vehicle } from '../models/vehicle';
import { Package } from '../models/package';

export class Scheduler {
    private vehicles: Vehicle[];
    private currentTime = 0;

    constructor(vehicles: Vehicle[]) {
        this.vehicles = vehicles;
    }

    schedulePackages(packages: Package[]): Package[] {
        const scheduled: Package[] = [];
        const pending = [...packages];

        while (pending.length) {
            const availableVehicle = this.getNextAvailableVehicle();

            const { selected, remaining } = this.selectPackages(pending, availableVehicle.maxWeight);
            if (!selected.length) break;

            selected.forEach(pkg => {
                const timeForPkg = pkg.distance / availableVehicle.maxSpeed;
                pkg.deliveryTime = this.currentTime + timeForPkg;
            });

            const maxTime = Math.max(...selected.map(pkg => pkg.distance / availableVehicle.maxSpeed));
            availableVehicle.availableAt = this.currentTime + maxTime * 2;
            scheduled.push(...selected);

            pending.length = 0;
            pending.push(...remaining);

            this.currentTime = Math.min(...this.vehicles.map(v => v.availableAt));
        }

        return scheduled;
    }

    private getNextAvailableVehicle(): Vehicle {
        return this.vehicles.reduce((earliest, v) =>
            v.availableAt < earliest.availableAt ? v : earliest
        );
    }

    // FIFO logic 
    private selectPackages(pending: Package[], maxWeight: number) {
        const selected: Package[] = [];
        let weightSum = 0;

        for (const pkg of pending) {
            if (weightSum + pkg.weight <= maxWeight) {
                selected.push(pkg);
                weightSum += pkg.weight;
            }
        }

        const remaining = pending.filter(p => !selected.includes(p));
        return { selected, remaining };
    }
}
