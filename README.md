# Kiki Courier 

A CLI-based delivery cost and time estimator built with Node.js and TypeScript.

This project simulates a courier service that calculates the delivery cost and time for a list of packages based on their weight, distance, and offer codes.

---

## Tech Stack

- Node.js
- TypeScript
- TDD with Jest (Test-Driven Development)
- Command Line Interface (CLI)

---

## Features

- Calculate total delivery cost and delivery time
- Support for dynamic input via CLI
- Offer code-based discounts
- Fully unit-tested


## Project Structure & Design Principles

This project follows **Clean Architecture** and **SOLID principles**, with clear separation of concerns:

| Folder/File                    | Purpose                                                                 |
|-------------------------------|-------------------------------------------------------------------------|
| `.env`, `.env.sample`         | Configuration for sensitive or environment-specific values              |
| `README.md`                   | Project overview, setup, and usage instructions                         |
| `package.json`, `tsconfig.json` | Project metadata, dependencies, and TypeScript compiler configuration  |
| `src/index.ts`                | Entry point of the CLI application                                      |
| `src/cli/`                    | Handles different CLI input modes and user prompts                      |
| `src/cli/helpers/`            | Shared CLI utility functions like input handling and execution flow     |
| `src/models/`                 | Domain models — represent core entities and encapsulate behavior        |
| `src/services/`              | Business logic orchestration — implement rules using models             |
| `src/services/offer/`         | Offer-specific logic and discount calculations                          |
| `src/services/delivery/`      | Cost and time estimation logic for deliveries                           |
| `src/services/vehicle/`       | Vehicle scheduling and availability management                          |
| `src/utils/`                  | Utility functions (e.g. config loader, input parser)                    |
| `src/types/`                  | Shared TypeScript type definitions                                      |
| `src/exceptions/`            | Custom exceptions for domain and application error handling             |
| `src/tests/`                  | Unit tests for all components                                           |
| `src/jest.config.ts`          | Jest configuration for running tests                                   |

---

### Models vs. Services

- **Models** (`src/models/`):
  - Represent domain entities with **data and entity-specific logic**.
  - Example: `OfferModel` includes methods like `isApplicable()` and `calculateDiscount()` — logic specific to the offer’s rules and discount behavior.
  - Promotes **encapsulation** and **testability**.

- **Services** (`src/services/`):
  - Implement **core business processes** using multiple models.
  - Example: `VehicleSchedulerService` schedules packages across vehicles by interacting with multiple models and applying delivery rules.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kiki-courier.git
cd kiki-courier
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
Create a .env file in the root directory by copying .env.sample
```

4. Usage
```bash
npm start
```

## Sample Input and Output

Option 1
```bash
Select operation:
1. Delivery Cost Estimation Only
2. Delivery Cost + Time Estimation with Vehicle Scheduling
3. Combined Input Handling (Auto-detects if vehicle info is present)
Enter choice (1, 2, or 3): 1
Enter base delivery cost and number of packages: 100 3
Enter package 1 details (id weight distance offer_code): PKG1 5 5 OFR001
Enter package 2 details (id weight distance offer_code): PKG2 15 5 OFR002
Enter package 3 details (id weight distance offer_code): PKG3 10 100 OFR003

Output:
PKG1 0 175
PKG2 0 275
PKG3 35 665
```
Option 2
```bash
Select operation:
1. Delivery Cost Estimation Only
2. Delivery Cost + Time Estimation with Vehicle Scheduling
3. Combined Input Handling (Auto-detects if vehicle info is present)
Enter choice (1, 2, or 3): 2
Enter base delivery cost and number of packages: 100 5
Enter package 1 details (id weight distance offer_code): PKG1 50 30 OFR001
Enter package 2 details (id weight distance offer_code): PKG2 75 125 OFR0008
Enter package 3 details (id weight distance offer_code): PKG3 175 100 OFR003
Enter package 4 details (id weight distance offer_code): PKG4 110 60 OFR002
Enter package 5 details (id weight distance offer_code): PKG5 155 95 NA
Enter number_of_vehicles max_speed max_carriable_weight: 2 70 200

Output:
PKG1 0 750 3.98
PKG2 0 1475 1.78
PKG3 0 2350 1.42
PKG4 105 1395 0.85
PKG5 0 2125 4.19
```
Option 3
```bash
Select operation:
1. Delivery Cost Estimation Only
2. Delivery Cost + Time Estimation with Vehicle Scheduling
3. Combined Input Handling (Auto-detects if vehicle info is present)
Enter choice (1, 2, or 3): 3
Enter input:
100 5
PKG1 50 30 OFR001
PKG2 75 125 OFFR0008
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200

(Press ENTER & CTRL+D to get Output)
Output:
PKG1 0 750 3.98
PKG2 0 1475 1.78
PKG3 0 2350 1.42
PKG4 105 1395 0.85
PKG5 0 2125 4.19
```
Option 3
```bash
Select operation:
1. Delivery Cost Estimation Only
2. Delivery Cost + Time Estimation with Vehicle Scheduling
3. Combined Input Handling (Auto-detects if vehicle info is present)
Enter choice (1, 2, or 3): 3
Enter input:
100 5
PKG1 50 30 OFR001
PKG2 75 125 OFFR0008
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA

(Press ENTER & CTRL+D to get Output)
Output:
PKG1 0 750
PKG2 0 1475
PKG3 0 2350
PKG4 105 1395
PKG5 0 2125
```
## Running Tests

Unit tests are written using Jest.

To run tests:

```bash
npm test
```
This will execute all tests in the src/tests/ directory.