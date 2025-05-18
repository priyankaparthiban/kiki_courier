import { parseInputStrings } from "../utils/inputParser";
import { PackageInput } from '../types/index';

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

        const expectedPkg1: Partial<PackageInput> = {
            id: "PKG1",
            weight: 20,
            distance: 5,
            offerCode: "OFR001",
        };

        const expectedPkg2: Partial<PackageInput> = {
            id: "PKG2",
            weight: 15,
            distance: 10,
            offerCode: "OFR002",
        };

        expect(result.packages[0]).toMatchObject(expectedPkg1);
        expect(result.packages[1]).toMatchObject(expectedPkg2);
    });
});
