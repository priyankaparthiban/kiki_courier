import { DeliveryRequestInput, PackageInput } from "../types";

export const parseInputStrings = (
    baseLine: string,
    packageLines: string[]
): DeliveryRequestInput => {
    const [baseCostStr, noOfPackagesStr] = baseLine.trim().split(" ");
    const baseCost = parseInt(baseCostStr);
    const noOfPackages = parseInt(noOfPackagesStr);

    const packages: PackageInput[] = packageLines.map((line) => {
        const [id, weightStr, distanceStr, offerCode] = line.trim().split(" ");
        return {
            id,
            weight: parseFloat(weightStr),
            distance: parseFloat(distanceStr),
            offerCode,
        };
    });

    return {
        baseCost,
        noOfPackages,
        packages,
    };
};
