import { parseInputStrings, parseVehicleInput } from "../utils/input-parser";
import { PackageData, IVehicle } from '../types/index';

describe("Input Parser", () => {
    it("should parse base cost and package info from input strings", () => {
        const baseLine = "100 2";
        const packageLines = [
            "PKG1 20 5 OFR001",
            "PKG2 15 10 OFR002",
        ];

        const result = parseInputStrings(baseLine, packageLines);

        expect(result.baseCost).toBe(100);
        expect(result.noOfPackages).toBe(2);
        expect(result.packages).toHaveLength(2);

        const expectedPkg1: Partial<PackageData> = {
            id: "PKG1",
            weight: 20,
            distance: 5,
            offerCode: "OFR001",
        };

        const expectedPkg2: Partial<PackageData> = {
            id: "PKG2",
            weight: 15,
            distance: 10,
            offerCode: "OFR002",
        };

        expect(result.packages[0]).toMatchObject(expectedPkg1);
        expect(result.packages[1]).toMatchObject(expectedPkg2);
    });

    it("should parse valid vehicle input", () => {
        const input = "2 70 200";
        const result = parseVehicleInput(input);

        expect(result).toHaveLength(2);

        const expectedVehicle: Partial<IVehicle> = {
            maxSpeed: 70,
            maxWeight: 200,
            availableAt: 0,
        };

        expect(result[0]).toMatchObject({ id: 1, ...expectedVehicle });
        expect(result[1]).toMatchObject({ id: 2, ...expectedVehicle });
    });

});
