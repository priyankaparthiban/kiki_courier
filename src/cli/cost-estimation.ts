import { PackageInput, DeliveryResult } from '../types/index';
import { DeliveryCostCalculator } from '../services/deliveryCalculator';
import { OfferService } from '../services/offerService';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const offerService = new OfferService();

const prompt = (query: string): Promise<string> => {
    return new Promise(resolve => rl.question(query, resolve));
};

async function main() {
    try {

        const baseInput = await prompt('Enter base delivery cost and number of packages: ');
        const [baseCostStr, pkgCountStr] = baseInput.trim().split(' ');
        const baseCost = Number(baseCostStr);
        const pkgCount = Number(pkgCountStr);

        if (isNaN(baseCost) || isNaN(pkgCount)) {
            console.error('Invalid input. Expected: <base_cost> <number_of_packages>');
            rl.close();
            return;
        }

        const calculator = new DeliveryCostCalculator(baseCost);
        const packages: PackageInput[] = [];

        for (let i = 0; i < pkgCount; i++) {
            const pkgInput = await prompt(`Enter package ${i + 1} details (id weight distance offer_code): `);
            const [id, weightStr, distanceStr, offerCode] = pkgInput.trim().split(' ');

            const weight = Number(weightStr);
            const distance = Number(distanceStr);

            if (!id || isNaN(weight) || isNaN(distance)) {
                console.error(`Invalid input for package ${i + 1}. Skipping...`);
                continue;
            }

            packages.push({
                id,
                weight,
                distance,
                offerCode: offerCode || null,
                discount: 0,
                totalCost: 0,
                deliveryTime: null,
            });
        }

        console.log('\nOutput:');
        for (const pkg of packages) {
            const baseDeliveryCost = calculator.calculateDeliveryCost(pkg);
            const discount = offerService.getDiscount(pkg.offerCode || '', baseDeliveryCost, pkg.weight, pkg.distance);
            const totalCost = Math.round(baseDeliveryCost - discount);

            const result: DeliveryResult = {
                id: pkg.id,
                discount: Math.round(discount),
                totalCost
            };

            console.log(`${result.id} ${result.discount} ${result.totalCost}`);
        }
    }
    catch (error: any) {
        console.error('An unexpected error occurred:', error.message || error);
    } finally {
        rl.close();
    }
}

main();
