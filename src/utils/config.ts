// src/utils/env.ts
import dotenv from 'dotenv';

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
export const BASE_DELIVERY_COST = getEnvNumber('BASE_DELIVERY_COST', 100);
