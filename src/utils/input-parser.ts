import { DeliveryRequestInput, PackageData, IVehicle } from '../types';
import { VehicleModel } from '../models';
export function parseInputStrings(baseLine: string, packageLines: string[]): DeliveryRequestInput {
    const [baseCostStr, noOfPackagesStr] = baseLine.trim().split(' ');
    const baseCost = Number(baseCostStr);
    const noOfPackages = Number(noOfPackagesStr);

    const packages: PackageData[] = packageLines.map(line => {
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

export function parseVehicleInput(inputLine: string): IVehicle[] {
    const [vehicleCountStr, maxSpeedStr, maxWeightStr] = inputLine.trim().split(' ');
    const vehicleCount = Number(vehicleCountStr);
    const maxSpeed = Number(maxSpeedStr);
    const maxWeight = Number(maxWeightStr);
    // VehicleModel implements IVehicle
    return Array.from({ length: vehicleCount }, (_, i) =>
        // returns IVehicle[]
        new VehicleModel({
            id: i + 1,
            vehicleCount,
            maxSpeed,
            maxWeight,
            availableAt: 0,
        })
    );
}
