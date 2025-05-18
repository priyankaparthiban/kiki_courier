import { DeliveryRequestInput, PackageInput } from '../types/index';

export function parseInputStrings(baseLine: string, packageLines: string[]): DeliveryRequestInput {
    const [baseCostStr, noOfPackagesStr] = baseLine.trim().split(' ');
    const baseCost = Number(baseCostStr);
    const noOfPackages = Number(noOfPackagesStr);

    const packages: PackageInput[] = packageLines.map(line => {
        const [id, weightStr, distanceStr, offerCode] = line.trim().split(' ');
        return {
            id,
            weight: Number(weightStr),
            distance: Number(distanceStr),
            offerCode: offerCode || null,
            discount: 0,
            totalCost: 0,
            deliveryTime: null
        };
    });

    return { baseCost, noOfPackages, packages };
}
