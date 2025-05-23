import { parseInputStrings, parseVehicleInput, } from '../utils';
import { askMultilineInput, createInterface, outputResults, createDeliveryCalculator, handleError } from './helpers';
import {
    DeliveryCostCalculator,
} from '../services';
import { DeliveryResult, IVehicle } from '../types';

async function main() {
    const rl = createInterface();

    try {
        // Step 1: Get multiline input
        const { baseCost, noOfPackages, lines } = await askMultilineInput(rl);

        // Step 2: Split lines for packages and vehicles
        const packageLines = lines.slice(1, 1 + noOfPackages);
        const vehicleLine = lines[1 + noOfPackages];
        const hasVehicleInfo = Boolean(vehicleLine);

        // Step 3: Parse input data
        const { packages: inputPackages } = parseInputStrings(lines[0], packageLines);

        // Step 4: Instantiate required services
        let deliveryCalculator: DeliveryCostCalculator;

        if (hasVehicleInfo) {
            const vehicles: IVehicle[] = parseVehicleInput(vehicleLine);
            deliveryCalculator = createDeliveryCalculator(baseCost, vehicles);

            // Step 5: Get cost + time estimation
            const results: DeliveryResult[] = deliveryCalculator.getCostAndTimeEstimation(inputPackages);

            // Step 6: Output results
            outputResults(results);
        } else {
            deliveryCalculator = createDeliveryCalculator(baseCost);
            // Step 5: Get cost estimation
            const results: DeliveryResult[] = deliveryCalculator.getCostEstimation(inputPackages);

            // Step 6: Output results
            outputResults(results);
        }
    } catch (err) {
        handleError(err);
    } finally {
        rl.close();
    }
}

void main();
