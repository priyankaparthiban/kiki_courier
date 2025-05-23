import { CostCalculator, OfferService, VehicleScheduler, DeliveryCostCalculator } from '../../services';
import { IVehicle, DeliveryResult } from '../../types';
import { UnknownException } from '../../exceptions';

export function createDeliveryCalculator(
  baseCost: number,
  vehicles?: IVehicle[]
): DeliveryCostCalculator {
  const baseCostCalculator = new CostCalculator(baseCost);
  const offerService = new OfferService();
  const vehicleScheduler = vehicles ? new VehicleScheduler(vehicles) : undefined;

  return new DeliveryCostCalculator(
    baseCostCalculator,
    offerService,
    vehicleScheduler
  );
}

export function outputResults(results: DeliveryResult[]): void {
  console.log('\nOutput:');
  results.forEach(r => {
    const line = [r.id, r.discount, r.totalCost, r.deliveryTime]
      .filter(v => v !== undefined && v !== null)
      .join(' ');
    console.log(line);
  });
}

export function handleError(error: unknown): void {
  const err = error instanceof Error ? new UnknownException(error.message) : new UnknownException('An unknown error occurred');
  console.error('Error:', err.message);
}


