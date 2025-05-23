import { IPackage } from '../../types';
import {
    AllPackageTooHeavyException
} from '../../exceptions';

export class PackageSelector {
    constructor() { }

    selectPackages(pending: IPackage[], maxWeight: number) {
        const allCombos: IPackage[][] = [];

        // Check if all packages are too heavy to be carried
        const allOverweight = pending.every(pkg => pkg.getWeight() > maxWeight);
        if (allOverweight) {
            throw new AllPackageTooHeavyException('All packages exceed the maximum carriable weight.');
        }

        // To generate all possible combinations of packages
        const generateCombos = (start: number, combo: IPackage[]) => {
            // Calculate the total weight of the current combination
            const totalWeight = combo.reduce((sum, p) => sum + p.getWeight(), 0);

            // If it's a non-empty valid combo under the max weight, save it
            if (combo.length > 0 && totalWeight <= maxWeight) {
                allCombos.push([...combo]);
            }

            // Generate further combinations
            for (let i = start; i < pending.length; i++) {
                combo.push(pending[i]);         // Include current package
                generateCombos(i + 1, combo);   // Recurse with next index
                combo.pop();                    // Backtrack
            }
        };

        // Start generating combinations from the first package
        generateCombos(0, []);

        // If no valid combinations are found
        if (!allCombos.length) {
            return { selected: [], remaining: pending };
        }

        // Sort combinations based on:
        // 1. Number of packages (desc)
        // 2. Total weight (desc)
        // 3. Max distance (asc)
        allCombos.sort((a, b) => {
            if (b.length !== a.length) return b.length - a.length;

            const totalWeightA = a.reduce((sum, p) => sum + p.getWeight(), 0);
            const totalWeightB = b.reduce((sum, p) => sum + p.getWeight(), 0);
            if (totalWeightB !== totalWeightA) return totalWeightB - totalWeightA;

            const maxDistA = Math.max(...a.map(p => p.getDistance()));
            const maxDistB = Math.max(...b.map(p => p.getDistance()));
            return maxDistA - maxDistB;
        });

        // Take the best combination
        const selected = allCombos[0];

        // Identify remaining packages not in the selected group
        const selectedIds = new Set(selected.map(p => p.getId()));
        const remaining = pending.filter(p => !selectedIds.has(p.getId()));

        return { selected, remaining };
    }
}
