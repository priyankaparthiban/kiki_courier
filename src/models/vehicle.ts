export class Vehicle {
    id: number;
    maxSpeed: number;
    maxWeight: number;
    availableAt: number = 0;

    constructor(id: number, maxSpeed: number, maxWeight: number) {
        this.id = id;
        this.maxSpeed = maxSpeed;
        this.maxWeight = maxWeight;
    }

    assignDelivery(time: number) {
        this.availableAt += time * 2; // round trip
    }
}
