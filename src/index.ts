import readline from 'readline';
import { spawn } from 'child_process';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askChoice() {
    console.log('\nSelect operation:');
    console.log('1. Delivery Cost Estimation Only');
    console.log('2. Delivery Cost + Time Estimation with Vehicle Scheduling');
    console.log('3. Combined Input Handling (Auto-detects if vehicle info is present)');

    rl.question('Enter choice (1, 2, or 3): ', (choice) => {
        const scriptPath =
            choice === '1'
                ? path.join(__dirname, 'cli/cost-estimation.ts')
                : choice === '2'
                    ? path.join(__dirname, 'cli/delivery-estimation.ts')
                    : choice === '3'
                        ? path.join(__dirname, 'cli/combined-input.ts')
                        : null;

        if (!scriptPath) {
            console.error('\n Invalid choice. Please enter 1, 2, or 3.\n');
            return askChoice(); // Retry
        }

        rl.close();

        // Spawn the child process with stdio inherited for interactive I/O
        const child = spawn('ts-node', [scriptPath], {
            stdio: 'inherit',
            shell: true,
        });

        child.on('exit', (code) => {
            if (code === 0) {
                console.log('\n Process completed successfully.');
            } else {
                console.log(`\n Process exited with error code ${code}. Please check your inputs or try again.`);
            }
        });
        child.on('error', (err) => {
            console.error('\n Failed to start the selected operation.', err);
            askChoice(); // Retry if spawning fails
        });
    });
}

askChoice();
