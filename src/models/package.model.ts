import { PackageData, IPackage } from '../types';

// Package class encapsulates the package's data and methods to manipulate it.
export class Package implements IPackage {
    private readonly id: string;
    private readonly weight: number;
    private readonly distance: number;
    private readonly offerCode: string | null;
    private discount = 0;
    private totalCost = 0;
    private deliveryTime: number | null = null;

    constructor(pkg: PackageData) {
        this.id = pkg.id;
        this.weight = pkg.weight;
        this.distance = pkg.distance;
        this.offerCode = pkg.offerCode || null;
    }

    getId(): string {
        return this.id;
    }

    getWeight(): number {
        return this.weight;
    }

    getDistance(): number {
        return this.distance;
    }

    getOfferCode(): string {
        return this.offerCode || '';
    }

    getDiscount(): number {
        return this.discount;
    }

    getTotalCost(): number {
        return this.totalCost;
    }

    setDiscount(discount: number): void {
        this.discount = discount;
    }

    setTotalCost(totalCost: number): void {
        this.totalCost = totalCost;
    }

    setDeliveryTime(time: number): void {
        this.deliveryTime = time;
    }

    getDeliveryTime(): number | null {
        return this.deliveryTime;
    }

    applyCost(discount: number, totalCost: number): void {
        this.discount = discount;
        this.totalCost = totalCost;
    }

    hasOffer(): boolean {
        return !!this.offerCode;
    }

    toOutput(): string {
        return this.deliveryTime !== null
            ? `${this.id} ${this.discount} ${this.totalCost} ${this.deliveryTime}`
            : `${this.id} ${this.discount} ${this.totalCost}`;
    }
}
