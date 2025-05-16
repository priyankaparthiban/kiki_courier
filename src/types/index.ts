export interface PackageInput {
    id: string;
    weight: number;
    distance: number;
    offerCode: string;
}

export interface DeliveryRequestInput {
    baseCost: number;
    noOfPackages: number;
    packages: PackageInput[];
}
