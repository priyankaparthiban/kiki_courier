import dotenv from 'dotenv';
import { Offer } from '../types/index';
import { InvalidEnvVariableException } from '../exceptions';

dotenv.config();
function parseOfferConfig(code: string): Offer {
    return {
        code,
        discountPercent: getEnvNumber(`${code}_DISCOUNT_PERCENT`),
        minWeight: getEnvNumber(`${code}_MIN_WEIGHT`),
        maxWeight: getEnvNumber(`${code}_MAX_WEIGHT`),
        minDistance: getEnvNumber(`${code}_MIN_DISTANCE`),
        maxDistance: getEnvNumber(`${code}_MAX_DISTANCE`),
    };
}
function getEnvNumber(key: string, defaultValue?: number): number {
    const val = process.env[key];

    if (val === undefined || val === '') {
        if (defaultValue !== undefined) return defaultValue;
        throw new InvalidEnvVariableException(key, 'Value is required but missing');
    }

    const parsed = Number(val);
    if (isNaN(parsed)) {
        throw new InvalidEnvVariableException(key, 'Not a valid number');
    }

    return parsed;
}

export const COST_PER_KG = getEnvNumber('COST_PER_KG', 10);
export const COST_PER_KM = getEnvNumber('COST_PER_KM', 5);

export function getOffersFromEnv(): Offer[] {
    const offers: Offer[] = [];
    const offerCodes = process.env.OFFERS?.split(',').map(code => code.trim()) || [];

    for (const code of offerCodes) {
        try {
            offers.push(parseOfferConfig(code));
        } catch (error) {
            console.warn(`Skipping invalid offer config for code "${code}": ${(error as Error).message}`);
        }
    }

    return offers;
}
