import { parseInputStrings } from '../utils';
import { askBaseDetails, askPackageDetails, createInterface, outputResults, createDeliveryCalculator, handleError } from './helpers';
import { DeliveryResult } from '../types';
async function main() {
    const rl = createInterface();

    try {
        // Step 1: Ask for base cost and number of packages
        const { baseCost, noOfPackages } = await askBaseDetails(rl);

        // Step 2: Ask for package details
        const packageInputs = await askPackageDetails(rl, noOfPackages);

        // Step 3: Parse string inputs into usable data
        const { packages } = parseInputStrings(`${baseCost} ${noOfPackages}`, packageInputs);

        // Step 4: Instantiate required services
        const deliveryCalculator = createDeliveryCalculator(baseCost);

        // Step 5: Get cost estimation
        const results: DeliveryResult[] = deliveryCalculator.getCostEstimation(packages);

        // Step 6: Output results
        outputResults(results);

    } catch (err) {
        handleError(err);
    } finally {
        rl.close();
    }
}

void main();
