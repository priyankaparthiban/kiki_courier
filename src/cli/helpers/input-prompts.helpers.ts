import readline from 'readline';
import {
    InvalidInputFormatException,
    MissingInputException,
    UnknownException,
    InsufficientInputException
} from '../../exceptions';

export const createInterface = () =>
    readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

export const askBaseDetails = async (rl: readline.Interface): Promise<{ baseCost: number, noOfPackages: number }> => {
    return new Promise((resolve, reject) => {
        try {
            rl.question('Enter base delivery cost and number of packages: ', (answer) => {
                const [baseCostStr, noOfPackagesStr] = answer.trim().split(' ');

                if (!baseCostStr || !noOfPackagesStr) {
                    return reject(new MissingInputException('<base_cost> <number_of_packages>'));
                }

                const baseCost = Number(baseCostStr);
                const noOfPackages = Number(noOfPackagesStr);

                if (isNaN(baseCost) || isNaN(noOfPackages)) {
                    return reject(new InvalidInputFormatException('<base_cost> <number_of_packages> must be valid numbers'));
                }

                resolve({ baseCost, noOfPackages });
            });
        } catch (err) {
            reject(new UnknownException(`Failed to parse base details: ${(err as Error).message}`));
        }
    });
};

export const askPackageDetails = async (rl: readline.Interface, noOfPackages: number): Promise<string[]> => {
    const packages: string[] = [];

    const askNext = (index: number): Promise<void> =>
        new Promise((resolve, reject) => {
            try {
                rl.question(`Enter package ${index + 1} details (id weight distance offer_code): `, (answer) => {
                    const [id, weightStr, distanceStr] = answer.trim().split(' ');

                    if (!id || !weightStr || !distanceStr) {
                        return reject(new MissingInputException(`<pkg_id> <weight> <distance> required at line ${index + 1}`));
                    }

                    if (isNaN(Number(weightStr)) || isNaN(Number(distanceStr))) {
                        return reject(new InvalidInputFormatException(`Valid number format for weight and distance at package ${index + 1}`));
                    }

                    packages.push(answer.trim());
                    resolve();
                });
            } catch (err) {
                reject(new UnknownException(`Error reading package ${index + 1}: ${(err as Error).message}`));
            }
        });

    for (let i = 0; i < noOfPackages; i++) {
        await askNext(i);
    }

    return packages;
};

export const askVehicleDetails = async (rl: readline.Interface): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            rl.question('Enter number_of_vehicles max_speed max_carriable_weight: ', (answer) => {
                const [countStr, speedStr, weightStr] = answer.trim().split(' ');

                if (!countStr || !speedStr || !weightStr) {
                    return reject(new MissingInputException('<vehicle_count> <max_speed> <max_weight>'));
                }

                if (isNaN(Number(countStr)) || isNaN(Number(speedStr)) || isNaN(Number(weightStr))) {
                    return reject(new InvalidInputFormatException('All vehicle inputs must be valid numbers.'));
                }

                resolve(answer.trim());
            });
        } catch (err) {
            reject(new UnknownException(`Failed to read vehicle details: ${(err as Error).message}`));
        }
    });
};

export const askMultilineInput = async (
    rl: readline.Interface
): Promise<{ baseCost: number; noOfPackages: number; lines: string[] }> => {
    return new Promise((resolve, reject) => {
        const lines: string[] = [];

        console.log('Enter input lines(vehicle info - optional). Press Ctrl+D when done:');

        rl.on('line', (line) => {
            lines.push(line.trim());
        });

        rl.on('close', () => {
            try {
                if (lines.length < 2) {
                    return reject(new InsufficientInputException(`
              Expected at least 2 lines:
                <base_cost> <number_of_packages>
                <pkg_id_1> <weight_1> <distance_1> <offer_code_1>
                ...
                <vehicle_count> <max_speed> <max_carriable_weight>
            `));
                }

                const [baseCostStr, noOfPackagesStr] = lines[0].split(' ');
                const baseCost = Number(baseCostStr);
                const noOfPackages = Number(noOfPackagesStr);

                if (isNaN(baseCost) || isNaN(noOfPackages)) {
                    return reject(new InvalidInputFormatException(
                        '<base_cost> <number_of_packages> must be valid numbers'
                    ));
                }

                resolve({ baseCost, noOfPackages, lines });
            } catch (err) {
                reject(new UnknownException(`Failed to parse input: ${(err as Error).message}`));
            }
        });
    });
};

