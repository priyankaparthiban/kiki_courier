// PackageData represents the input data for a package.
export interface PackageData {
    id: string;
    weight: number;
    distance: number;
    offerCode: string | null;
}

// IPackage represents the essential behaviour of a package.
export interface IPackage {
    getId(): string;
    getWeight(): number;
    getDistance(): number;
    getOfferCode(): string;
    getDiscount(): number;
    getTotalCost(): number;
    setDiscount(discount: number): void;
    setTotalCost(totalCost: number): void;
    setDeliveryTime(time: number): void;
    getDeliveryTime(): number | null;
    applyCost(discount: number, totalCost: number): void;
    hasOffer(): boolean;
    toOutput(): string;

}

// DeliveryRequest represents a request to calculate delivery costs and schedules.
export interface DeliveryRequestInput {
    baseCost: number;
    noOfPackages: number;
    packages: PackageData[];
}

// DeliveryResult represents the result of a delivery cost estimation.
export interface DeliveryResult {
    id: string;
    discount: number;
    totalCost: number;
    deliveryTime?: number | null;
}

// Offer represents the discount offer information.
export interface Offer {
    code: string;
    discountPercent: number;
    minWeight: number;
    maxWeight: number;
    minDistance: number;
    maxDistance: number;
}

// IOffer represents the essential behaviour of a offer.
export interface IOffer {
    code: string;
    isApplicable(weight: number, distance: number): boolean;
    calculateDiscount(cost: number): number;
}

// VehicleData represents the essential data of a vehicle.
export interface VehicleData {
    id: number;
    vehicleCount: number;
    maxSpeed: number;
    maxWeight: number;
    availableAt: number;
}

// IVehicle represents the essential behaviour of a vehicle.
export interface IVehicle extends VehicleData {
    updateAvailability?(newAvailableAt: number): void;
    travelTime?(distance: number): number;
}




