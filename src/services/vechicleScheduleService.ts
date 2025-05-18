import { Vehicle } from '../models/vehicle';
import { Package } from '../models/package';

export class Scheduler {
    private vehicles: Vehicle[];

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

            const maxDistance = Math.max(...selected.map(pkg => pkg.distance));
            const deliveryStart = availableVehicle.availableAt;

            selected.forEach(pkg => {
                const deliveryTime = deliveryStart + (pkg.distance / availableVehicle.maxSpeed);
                pkg.deliveryTime = Math.floor(deliveryTime * 100) / 100;
                scheduled.push(pkg);
            });
            const oneWayTime = Math.floor((maxDistance / availableVehicle.maxSpeed) * 100) / 100;
            const returnTime = deliveryStart + (2 * oneWayTime);
            availableVehicle.availableAt = Math.floor(returnTime * 100) / 100;
            pending.length = 0;
            pending.push(...remaining);
        }

        // Sort packages by package ID
        scheduled.sort((a, b) => a.id.localeCompare(b.id));

        return scheduled;
    }

    private getNextAvailableVehicle(): Vehicle {
        return this.vehicles.reduce((earliest, v) =>
            v.availableAt < earliest.availableAt ? v : earliest
        );
    }

    private selectPackages(pending: Package[], maxWeight: number) {
        const allCombos: Package[][] = [];

        const generateCombos = (start: number, combo: Package[]) => {
            const totalWeight = combo.reduce((sum, p) => sum + p.weight, 0);
            if (combo.length > 0 && totalWeight <= maxWeight) {
                allCombos.push([...combo]);
            }

            for (let i = start; i < pending.length; i++) {
                combo.push(pending[i]);
                generateCombos(i + 1, combo);
                combo.pop();
            }
        };

        generateCombos(0, []);

        if (!allCombos.length) {
            return { selected: [], remaining: pending };
        }

        allCombos.sort((a, b) => {
            if (b.length !== a.length) return b.length - a.length;

            const totalWeightA = a.reduce((sum, p) => sum + p.weight, 0);
            const totalWeightB = b.reduce((sum, p) => sum + p.weight, 0);
            if (totalWeightB !== totalWeightA) return totalWeightB - totalWeightA;

            const maxDistA = Math.max(...a.map(p => p.distance));
            const maxDistB = Math.max(...b.map(p => p.distance));
            return maxDistA - maxDistB;
        });

        const selected = allCombos[0];
        const selectedIds = new Set(selected.map(p => p.id));
        const remaining = pending.filter(p => !selectedIds.has(p.id));

        return { selected, remaining };
    }
}
