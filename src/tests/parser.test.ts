import { parseInputStrings } from "../utils/inputParser";

describe("Input Parser", () => {
    it("should parse base cost and package info from input strings", () => {
        const baseLine = "100 2";
        const packageLines = [
            "PKG1 20 5 OFR001",
            "PKG2 15 10 OFR002",
        ];

        const result = parseInputStrings(baseLine, packageLines);

        expect(result).toEqual({
            baseCost: 100,
            noOfPackages: 2,
            packages: [
                { id: "PKG1", weight: 20, distance: 5, offerCode: "OFR001" },
                { id: "PKG2", weight: 15, distance: 10, offerCode: "OFR002" },
            ],
        });
    });
});
