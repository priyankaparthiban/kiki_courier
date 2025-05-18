import dotenv from 'dotenv';
import { Offer } from '../models/offer';

dotenv.config();

function getEnvNumber(key: string, defaultValue: number): number {
    const val = process.env[key];
    if (!val) return defaultValue;
    const parsed = Number(val);
    if (isNaN(parsed)) throw new Error(`Env var ${key} is not a valid number`);
    return parsed;
}

export const COST_PER_KG = getEnvNumber('COST_PER_KG', 10);
export const COST_PER_KM = getEnvNumber('COST_PER_KM', 5);

export function getOffersFromEnv(): Offer[] {
    const offers: Offer[] = [];
    const offerCodes = process.env.OFFERS?.split(',') || [];

    for (const code of offerCodes) {
        const discountPercent = Number(process.env[`${code}_DISCOUNT_PERCENT`]);
        const minWeight = Number(process.env[`${code}_MIN_WEIGHT`]);
        const maxWeight = Number(process.env[`${code}_MAX_WEIGHT`]);
        const minDistance = Number(process.env[`${code}_MIN_DISTANCE`]);
        const maxDistance = Number(process.env[`${code}_MAX_DISTANCE`]);

        if (
            !isNaN(discountPercent) &&
            !isNaN(minWeight) &&
            !isNaN(maxWeight) &&
            !isNaN(minDistance) &&
            !isNaN(maxDistance)
        ) {
            offers.push(
                new Offer(code, discountPercent, minWeight, maxWeight, minDistance, maxDistance)
            );
        }
    }

    return offers;
}
