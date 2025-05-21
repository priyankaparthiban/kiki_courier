import { DeliveryRequestInput, PackageInput } from '../types/index';
import { Vehicle } from '../types/index';
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

export function parseVehicleInput(inputLine: string): Vehicle[] {
    const [vehicleCountStr, maxSpeedStr, maxWeightStr] = inputLine.trim().split(' ');
    const vehicleCount = Number(vehicleCountStr);
    const maxSpeed = Number(maxSpeedStr);
    const maxWeight = Number(maxWeightStr);

    if (isNaN(vehicleCount) || isNaN(maxSpeed) || isNaN(maxWeight)) {
        throw new Error('Invalid vehicle input.');
    }

    return Array.from({ length: vehicleCount }, (_, i) => ({
        id: i + 1,
        maxSpeed,
        maxWeight,
        availableAt: 0,
    }));
}

