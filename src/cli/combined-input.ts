import readline from 'readline';
import { parseInputStrings } from '../utils/inputParser';
import { DeliveryCostCalculator } from '../services/deliveryCalculator';
import { OfferService } from '../services/offerService';
import { Scheduler } from '../services/vechicleScheduleService';
import { DeliveryResult, Vehicle } from '../types/index';
import { parseVehicleInput } from '../utils/inputParser';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const inputLines: string[] = [];

console.log('Enter input:');

rl.on('line', (line) => {
    inputLines.push(line.trim());
}).on('close', () => {
    try {
        if (inputLines.length < 2) {
            throw new Error('Insufficient input lines.');
        }

        const [baseCostStr, noOfPackagesStr] = inputLines[0].split(' ');
        const baseCost = Number(baseCostStr);
        const noOfPackages = Number(noOfPackagesStr);

        if (isNaN(baseCost) || isNaN(noOfPackages)) {
            throw new Error('Invalid base cost or number of packages.');
        }

        const packageLines = inputLines.slice(1, 1 + noOfPackages);
        const hasVehicleInfo = inputLines.length === 1 + noOfPackages + 1;

        const { packages } = parseInputStrings(inputLines[0], packageLines);

        const costCalculator = new DeliveryCostCalculator(baseCost);
        const offerService = new OfferService();

        // Apply cost and discount to each package
        packages.forEach(pkg => {
            const cost = costCalculator.calculateDeliveryCost(pkg);
            const discount = pkg.offerCode === 'NA' ? 0 : offerService.getDiscount(pkg.offerCode || '', cost, pkg.weight, pkg.distance);
            pkg.discount = discount;
            pkg.totalCost = cost - discount;
        });

        if (!hasVehicleInfo) {
            // Only cost estimation mode
            console.log('\nOutput:');
            packages.forEach(pkg => {
                console.log(`${pkg.id} ${Math.round(pkg.discount)} ${Math.round(pkg.totalCost)}`);
            });
            return;
        }

        // Cost + Delivery time estimation mode
        const vehicleInput = inputLines[inputLines.length - 1];
        const vehicles: Vehicle[] = parseVehicleInput(vehicleInput);

        const scheduler = new Scheduler(vehicles);
        const scheduledPackages = scheduler.schedulePackages(packages);

        // Output result
        console.log('\nOutput:');
        scheduledPackages.forEach(pkg => {
            const result: DeliveryResult = {
                id: pkg.id,
                discount: Math.round(pkg.discount),
                totalCost: Math.round(pkg.totalCost),
                deliveryTime: parseFloat(pkg.deliveryTime?.toFixed(2) || '0.00')
            };

            console.log(`${result.id} ${result.discount} ${result.totalCost} ${result.deliveryTime}`);
        });
    } catch (err: any) {
        console.error('Error:', err.message || err);
    }
});
