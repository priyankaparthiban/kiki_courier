import { Package } from '../../models';
import { PackageData, DeliveryResult, IVehicle, IPackage } from '../../types';
import { CostCalculator, OfferService, VehicleScheduler } from '..';
import { InvalidPackageDetailsException, NoVehiclesAvailableException } from '../../exceptions';



export class DeliveryCostCalculator {
    private costCalculatorService: CostCalculator;
    private offerService: OfferService;
    private vehicleSchedulerService?: VehicleScheduler;

    constructor(costCalculator: CostCalculator, offerService: OfferService, vehicleSchedulerService?: VehicleScheduler) {
        this.costCalculatorService = costCalculator;
        this.offerService = offerService;
        this.vehicleSchedulerService = vehicleSchedulerService;
    }

    // Method to convert input data to Package instances
    private createPackages(inputs: PackageData[]): IPackage[] {
        return inputs.map(p => {
            try {
                return new Package(p);
            } catch (e: any) {
                throw new InvalidPackageDetailsException(p.id, e.message);
            }
        });
    }

    getCostEstimation(inputs: PackageData[]): DeliveryResult[] {
        const packages = this.createPackages(inputs);

        packages.forEach(pkg => {
            const cost = this.costCalculatorService.calculateBaseCost(pkg);
            this.offerService.applyDiscount(pkg, cost);
        });

        return packages.map(pkg => ({
            id: pkg.getId(),
            discount: Math.round(pkg.getDiscount()),
            totalCost: Math.round(pkg.getTotalCost()),
        }));
    }

    getCostAndTimeEstimation(inputs: PackageData[], vehicles: IVehicle[]): DeliveryResult[] {
        const packages = this.createPackages(inputs);

        if (!this.vehicleSchedulerService) {
            throw new NoVehiclesAvailableException('Vehicle information is must to calculate delivery information');
        }
        packages.forEach(pkg => {
            const cost = this.costCalculatorService.calculateBaseCost(pkg);
            this.offerService.applyDiscount(pkg, cost);
        });

        const scheduled: IPackage[] = this.vehicleSchedulerService.schedulePackages(packages);

        return scheduled.map(pkg => ({
            id: pkg.getId(),
            discount: Math.round(pkg.getDiscount()),
            totalCost: Math.round(pkg.getTotalCost()),
            deliveryTime: Math.floor((pkg.getDeliveryTime() ?? 0) * 100) / 100,
        }));
    }
}
