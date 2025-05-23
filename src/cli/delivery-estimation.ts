import { parseInputStrings, parseVehicleInput } from '../utils';
import { askBaseDetails, askPackageDetails, createInterface, askVehicleDetails, outputResults, createDeliveryCalculator, handleError } from './helpers'
import { DeliveryResult } from '../types';
async function main() {
    const rl = createInterface();

    try {
        // Step 1: Ask for base cost and number of packages
        const { baseCost, noOfPackages } = await askBaseDetails(rl);

        // Step 2: Ask for package details
        const packageInputs = await askPackageDetails(rl, noOfPackages);

        // Step 3: Ask for vehicle details
        const vehicleLine = await askVehicleDetails(rl);

        // Step 4: Parse string inputs into usable data
        const { packages } = parseInputStrings(`${baseCost} ${noOfPackages}`, packageInputs);

        // Step 5: Parsing vehicle inputs into usable data
        const vehicles = parseVehicleInput(vehicleLine);

        // Step 6: Instantiate required services
        const deliveryCalculator = createDeliveryCalculator(baseCost, vehicles)

        // Step 7: Get cost + time estimation
        const results: DeliveryResult[] = deliveryCalculator.getCostAndTimeEstimation(packages, vehicles);
        console.log("results", results);

        // Step 8: Output results
        console.log('\n Output:');
        outputResults(results);

    } catch (err) {
        handleError(err);
    } finally {
        rl.close();
    }
}

main();
