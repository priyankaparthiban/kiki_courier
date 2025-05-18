export interface PackageInput {
    id: string;
    weight: number;
    distance: number;
    offerCode: string | null;
    discount: number;
    totalCost: number;
    deliveryTime: number | null;
}

export interface DeliveryRequestInput {
    baseCost: number;
    noOfPackages: number;
    packages: PackageInput[];
}

export interface DeliveryResult {
    id: string;
    discount: number;
    totalCost: number;
    deliveryTime?: number | null;
}

export interface Offer {
    code: string;
    discountPercent: number;
    minWeight: number;
    maxWeight: number;
    minDistance: number;
    maxDistance: number;
}

export interface Vehicle {
    id: number;
    maxSpeed: number;
    maxWeight: number;
    availableAt: number;
}