import readline from 'readline';
import { parseInputStrings } from '../utils/inputParser';
import { DeliveryResult, Vehicle } from '../types/index';
import { DeliveryCostCalculator } from '../services/deliveryCalculator';
import { OfferService } from '../services/offerService';
import { Scheduler } from '../services/vechicleScheduleService';
import { parseVehicleInput } from '../utils/inputParser';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let baseCost = 0;
let noOfPackages = 0;
let packageInputs: string[] = [];
let vehicleInput = '';

let currentPackageIndex = 0;

const askBaseDetails = () => {
    rl.question('Enter base delivery cost and number of packages: ', (answer) => {
        try {
            const [baseCostStr, noOfPackagesStr] = answer.trim().split(' ');
            baseCost = Number(baseCostStr);
            noOfPackages = Number(noOfPackagesStr);

            if (isNaN(baseCost) || isNaN(noOfPackages)) {
                throw new Error('Invalid base cost or number of packages input.');
            }

            askNextPackage();
        } catch (err: any) {
            console.error('Error:', err.message || err);
            rl.close();
        }
    });
};

const askNextPackage = () => {
    if (currentPackageIndex < noOfPackages) {
        rl.question(`Enter package ${currentPackageIndex + 1} details (id weight distance offer_code): `, (answer) => {
            try {
                const [id, weightStr, distanceStr] = answer.trim().split(' ');
                if (!id || isNaN(Number(weightStr)) || isNaN(Number(distanceStr))) {
                    throw new Error(`Invalid input format for package ${currentPackageIndex + 1}`);
                }
                packageInputs.push(answer.trim());
                currentPackageIndex++;
                askNextPackage();
            } catch (err: any) {
                console.error('Error:', err.message || err);
                rl.close();
            }
        });
    } else {
        askVehicleDetails();
    }
};

const askVehicleDetails = () => {
    rl.question('Enter number_of_vehicles max_speed max_carriable_weight: ', (answer) => {
        try {
            const [countStr, speedStr, weightStr] = answer.trim().split(' ');
            if (isNaN(Number(countStr)) || isNaN(Number(speedStr)) || isNaN(Number(weightStr))) {
                throw new Error('Invalid vehicle details input.');
            }
            vehicleInput = answer.trim();
            rl.close();
        } catch (err: any) {
            console.error('Error:', err.message || err);
            rl.close();
        }
    });
};

rl.on('close', () => {
    try {
        // Parse packages
        const { packages } = parseInputStrings(`${baseCost} ${noOfPackages}`, packageInputs);

        // Initialize services
        const deliveryCostCalculator = new DeliveryCostCalculator(baseCost);
        const offerService = new OfferService();

        // Cost & discount calculations
        packages.forEach((pkg) => {
            const cost = deliveryCostCalculator.calculateDeliveryCost(pkg);
            const discount =
                pkg.offerCode === 'NA'
                    ? 0
                    : offerService.getDiscount(pkg.offerCode || '', cost, pkg.weight, pkg.distance);
            pkg.discount = discount;
            pkg.totalCost = cost - discount;
        });

        // Parse vehicle info
        const vehicles: Vehicle[] = parseVehicleInput(vehicleInput);

        const scheduler = new Scheduler(vehicles);

        // Schedule delivery
        const scheduledPackages = scheduler.schedulePackages(packages);

        // Output results
        console.log('\nOutput:');
        scheduledPackages.forEach((pkg) => {
            const result: DeliveryResult = {
                id: pkg.id,
                discount: Math.round(pkg.discount),
                totalCost: Math.round(pkg.totalCost),
                deliveryTime: parseFloat(pkg.deliveryTime?.toFixed(2) || '0.00'),
            };

            console.log(`${result.id} ${result.discount} ${result.totalCost} ${result.deliveryTime}`);
        });
    } catch (err: any) {
        console.error('An unexpected error occurred during delivery estimation:', err.message || err);
    }
});

askBaseDetails();
