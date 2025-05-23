import { IPackage } from '../../types';
import {
    AllPackageTooHeavyException
} from '../../exceptions';

export class PackageSelector {
    constructor() { }

    selectPackages(pending: IPackage[], maxWeight: number) {
        const allCombos: IPackage[][] = [];

        const allOverweight = pending.every(pkg => pkg.getWeight() > maxWeight);
        if (allOverweight) {
            throw new AllPackageTooHeavyException('All packages exceed the maximum carriable weight.');
        }

        const generateCombos = (start: number, combo: IPackage[]) => {
            const totalWeight = combo.reduce((sum, p) => sum + p.getWeight(), 0);

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

            const totalWeightA = a.reduce((sum, p) => sum + p.getWeight(), 0);
            const totalWeightB = b.reduce((sum, p) => sum + p.getWeight(), 0);
            if (totalWeightB !== totalWeightA) return totalWeightB - totalWeightA;

            const maxDistA = Math.max(...a.map(p => p.getDistance()));
            const maxDistB = Math.max(...b.map(p => p.getDistance()));
            return maxDistA - maxDistB;
        });

        const selected = allCombos[0];
        const selectedIds = new Set(selected.map(p => p.getId()));

        const remaining = pending.filter(p => !selectedIds.has(p.getId()));

        return { selected, remaining };
    }
}
